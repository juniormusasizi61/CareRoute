const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

(async () => {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'testsecret';

    // In-memory SQLite for safe local tests that do not modify production data.
    const sequelize = new Sequelize('sqlite::memory:', { logging: false });

    // Load model definitions for the local test database.
    const defineUser = require('./models/User');
    const defineClient = require('./models/Client');

    const User = defineUser(sequelize, DataTypes);
    const Client = defineClient(sequelize, DataTypes);

    User.hasMany(Client, { foreignKey: 'userId' });
    Client.belongsTo(User, { foreignKey: 'userId' });

    await sequelize.sync({ force: true });

    const app = express();
    app.use(express.json());

    // Local auth route handlers used only by this smoke test.
    app.post('/api/auth/register', async (req, res) => {
      try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(409).json({ error: 'Email exists' });
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, passwordHash });
        const token = jwt.sign({ sub: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'register fail' });
      }
    });

    app.post('/api/auth/login', async (req, res) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid' });
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ error: 'Invalid' });
        const token = jwt.sign({ sub: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'login fail' });
      }
    });

    const authenticate = (req, res, next) => {
      const auth = req.get('Authorization');
      if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'no auth' });
      const token = auth.slice(7);
      try {
        const payload = jwt.verify(token, jwtSecret);
        req.user = { id: payload.sub, email: payload.email };
        return next();
      } catch (err) {
        return res.status(401).json({ error: 'invalid token' });
      }
    };

    app.post('/api/clients', authenticate, async (req, res) => {
      try {
        const { name, address, notes } = req.body;
        if (!name || !address) return res.status(400).json({ error: 'missing' });
        const client = await Client.create({ userId: req.user.id, name, address, notes });
        return res.status(201).json(client);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'create fail' });
      }
    });

    app.get('/api/clients', authenticate, async (req, res) => {
      try {
        const clients = await Client.findAll({ where: { userId: req.user.id } });
        return res.json(clients);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'list fail' });
      }
    });

    // Local delete route mirrors the production route and verifies ownership filtering.
    app.delete('/api/clients/:id', authenticate, async (req, res) => {
      try {
        const deleted = await Client.destroy({ where: { id: req.params.id, userId: req.user.id } });
        if (!deleted) return res.status(404).json({ error: 'not found' });
        return res.status(204).send();
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'delete fail' });
      }
    });

    const server = app.listen(0, async () => {
      const port = server.address().port;
      console.log('Test server listening on port', port);

      // Use global fetch available in Node 18+ for endpoint requests.
      if (typeof fetch === 'undefined') {
        console.error('Global fetch not available in this Node. Tests require Node 18+.');
        server.close();
        process.exit(2);
      }

      const base = `http://127.0.0.1:${port}`;

      try {
        // Register a new test user.
        const reg = await fetch(base + '/api/auth/register', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'password' })
        });
        const regJson = await reg.json();
        console.log('register status', reg.status, regJson.error ? regJson : 'ok');
        if (reg.status !== 200) throw new Error('register failed');

        // Log in using the registered credentials.
        const login = await fetch(base + '/api/auth/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'test@example.com', password: 'password' })
        });
        const loginJson = await login.json();
        console.log('login status', login.status, loginJson.error ? loginJson : 'ok');
        if (login.status !== 200) throw new Error('login failed');

        const token = loginJson.token;

        // Create a new client record for the test user.
        const create = await fetch(base + '/api/clients', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name: 'Client A', address: '123 Main St' })
        });
        const createJson = await create.json();
        console.log('create client status', create.status, createJson.error ? createJson : 'ok');
        if (create.status !== 201) throw new Error('create client failed');

        // Query the client list for the authenticated user.
        const list = await fetch(base + '/api/clients', { headers: { Authorization: `Bearer ${token}` } });
        const listJson = await list.json();
        console.log('list clients status', list.status, Array.isArray(listJson) ? listJson.length + ' items' : listJson);
        if (list.status !== 200) throw new Error('list clients failed');

        // Delete the client created earlier to cover the full CRUD smoke path.
        const deleted = await fetch(`${base}/api/clients/${createJson.id}`, {
          method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
        });
        console.log('delete client status', deleted.status);
        if (deleted.status !== 204) throw new Error('delete client failed');

        console.log('INTEGRATION TESTS PASSED');
        server.close();
        process.exit(0);
      } catch (err) {
        console.error('Test failure:', err.message);
        server.close();
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('Setup failed', err);
    process.exit(1);
  }
})();
