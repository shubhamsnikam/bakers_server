const express = require('express');
const router = express.Router();
const Ledger = require('../models/Ledger');

// GET all pending ledgers (total > 0)
router.get('/', async (req, res) => {
  try {
    // Fetch ledgers where total is greater than 0 and not marked as paid
    const ledgers = await Ledger.find({ total: { $gt: 0 }, paid: false })
      .populate('customer')
      .sort({ createdAt: -1 });

    if (!ledgers.length) {
      return res.status(404).json({ message: 'No pending ledgers found' });
    }

    res.json(ledgers);
  } catch (error) {
    console.error('Ledger fetch error:', error);
    res.status(500).json({ message: 'Server error fetching ledgers' });
  }
});

// POST: Add new ledger entry
router.post('/', async (req, res) => {
  const { customer, products, total } = req.body;

  try {
    // Validate required fields
    if (!customer || !products || !total) {
      return res.status(400).json({ message: 'Missing required fields: customer, products, or total' });
    }

    // Create a new ledger entry
    const newLedger = new Ledger({ customer, products, total });

    // Save the ledger entry
    const saved = await newLedger.save();

    // Send response with the saved ledger
    res.status(201).json(saved);
  } catch (error) {
    console.error('Ledger create error:', error);
    res.status(500).json({ message: 'Server error creating ledger' });
  }
});

// PATCH: Mark ledger as paid
router.patch('/:id/pay', async (req, res) => {
  try {
    // Find ledger by ID and mark it as paid, reset total to 0
    const updatedLedger = await Ledger.findByIdAndUpdate(
      req.params.id,
      { paid: true, total: 0 },
      { new: true }
    );

    if (!updatedLedger) {
      return res.status(404).json({ message: 'Ledger not found' });
    }

    // Respond with success message and updated ledger
    res.json({ message: 'Ledger marked as paid', ledger: updatedLedger });
  } catch (error) {
    console.error('Ledger pay error:', error);
    res.status(500).json({ message: 'Server error updating ledger' });
  }
});

module.exports = router;
