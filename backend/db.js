const dotenv = require('dotenv');
const { Sequelize, DataTypes } = require('sequelize');

dotenv.config();

// Use DATABASE_URL from environment or fall back to local Postgres defaults.
const databaseUrl = process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/careroute';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: { rejectUnauthorized: false },
  } : {},
});

// Load model definitions and wire associations.
const User = require('./models/User')(sequelize, DataTypes);
const Client = require('./models/Client')(sequelize, DataTypes);

User.hasMany(Client, { foreignKey: 'userId' });
Client.belongsTo(User, { foreignKey: 'userId' });

async function initDatabase() {
  // Confirm connectivity before syncing models.
  await sequelize.authenticate();

  try {
    // PostGIS is optional but helpful if GIS features are enabled in production.
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis_topology;');
  } catch (err) {
    console.warn('PostGIS extension check failed:', err.message);
  }

  // Create tables for all defined models.
  await sequelize.sync();
}

module.exports = {
  sequelize,
  User,
  Client,
  initDatabase,
};
