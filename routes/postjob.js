const express = require('express');
const Opportunity = require('../models/Opp')

const router = express.Router();

router.post('/getalljobs', async (req, res) => {
  try {
    const filters = req.body;
    const query = {};

    if (filters.type) query.type = filters.type;
    if (filters.mode) query.mode = filters.mode;
    if (filters.category) query.category = filters.category;
    if (filters.eligibility) query.eligibility = filters.eligibility;
    if (filters.location) query.location = filters.location;
    if (filters.tag) query.tags = filters.tag;

    const jobs = await Opportunity.find(query);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch jobs' });
  }
});

module.exports = router;