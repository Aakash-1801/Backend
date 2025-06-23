const express = require('express');
const Opportunity = require('../models/Opp')

const router = express.Router();

router.post('/getalljobs', async (req, res) => {
  try {
    const { type, mode, tag } = req.body;

    const query = {};

    if (type?.trim()) query.type = type;
    if (mode?.trim()) query.mode = mode;
    if (tag?.trim()) query.tags = { $in: [tag] };

    const jobs = await Opportunity.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error('Get filtered jobs error:', err);
    res.status(500).json({ error: 'Server error while fetching jobs' });
  }
});

module.exports = router;