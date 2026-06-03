const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { initDatabase } = require('./db');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const { authenticate } = require('./middleware/authMiddleware');

const app = express();

// Allow cross-origin requests and parse incoming JSON bodies.
app.use(cors());
app.use(express.json());

// Health endpoints for quick availability checks.
app.get('/', (req, res) => {
  res.json({ message: 'CareRoute backend is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount auth and client APIs, protecting client routes with authentication.
app.use('/api/auth', authRoutes);
app.use('/api/clients', authenticate, clientRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // Ensure database connection and schema are ready before listening.
    await initDatabase();
    console.log('Database initialized successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
