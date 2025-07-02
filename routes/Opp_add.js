const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opp');
const FilterOptions = require('../models/FilterOption');
const updateFilters = require('../middleware/updateFilters');
const verifyToken = require('../middleware/auth');
const checkPermission = require('../middleware/checkpermission');

// POST /api/opportunity/add
router.post('/add', verifyToken, checkPermission('create-opportunity'), updateFilters, async (req, res) => {
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

    res.status(201).json({ message: 'Opportunity added successfully' });

  } catch (error) {
    console.error('Add Opportunity Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/opportunity/filters
router.get('/filters', async (req, res) => {
  try {
    const filters = await FilterOptions.findOne();
    res.json(filters || {});
  } catch (err) {
    console.error('Fetch filters error:', err);
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

// router.get('/by-company', async (req, res) => {
//   try {
//     const companyName = req.body.companyName;
//     const opportunities = await Opportunity.find({ company: companyName }).select('opportunity');

//     const result = await Promise.all(
//       opportunities.map(async (opp) => {
//         const users = await Registration.find({ opportunity: opp.opportunity });
//         return {
//           opportunity: opp.opportunity,
//           registeredUsers: users
//         };
//       })
//     );

//     res.json(result);
//   } catch (err) {
//     console.error('Error fetching company opportunities with users:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

module.exports = router;