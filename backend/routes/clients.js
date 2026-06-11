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

// Remove a client that belongs to the authenticated user.
// The userId condition prevents users from deleting another user's records.
router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await Client.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!deletedCount) {
      return res.status(404).json({ error: 'Client not found.' });
    }

    return res.status(204).send();
  } catch (err) {
    console.error('Failed to delete client:', err);
    return res.status(500).json({ error: 'Unable to delete client.' });
  }
});

module.exports = router;
