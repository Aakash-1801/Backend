const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opp');

router.post('/add', async (req, res) => {
  try {
    const data = req.body;
    const requiredFields = ['opportunity', 'company', 'type'];
    for (let field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ error: `${field} is required.` });
      }
    }

    const existing = await Opportunity.findOne({
      opportunity: data.opportunity,
      company: data.company
    });

    if (existing) {
      return res.status(409).json({
        error: 'This opportunity already exists for this company.'
      });
    }

    const opportunity = new Opportunity(data);
    await opportunity.save();

    res.status(201).json({message: 'Opportunity added successfully'});

  } catch (error) {
    console.error('Add Opportunity Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;