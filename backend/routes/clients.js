const express = require('express');
const { Client } = require('../db');

const router = express.Router();

// Fetch all clients that belong to the authenticated user.
router.get('/', async (req, res) => {
  try {
    const clients = await Client.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    return res.json(clients);
  } catch (err) {
    console.error('Failed to load clients:', err);
    return res.status(500).json({ error: 'Unable to fetch clients.' });
  }
});

// Create a new client record for the authenticated user.
router.post('/', async (req, res) => {
  try {
    const { name, address, notes } = req.body;
    if (!name || !address) {
      return res.status(400).json({ error: 'Client name and address are required.' });
    }

    const client = await Client.create({
      userId: req.user.id,
      name,
      address,
      notes: notes || null,
    });

    return res.status(201).json(client);
  } catch (err) {
    console.error('Failed to create client:', err);
    return res.status(500).json({ error: 'Unable to create client.' });
  }
});

module.exports = router;
