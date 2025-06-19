const express = require('express');
const Company = require('../models/Company');

const router = express.Router();

router.post('/postjob', async (req, res) => {
    try {
        const { opportunity, location,} = req.body;
        
        if (!opportunity) {
            res.status(400).json({ message: "opportunity field needed" });
        }
        if (!location) {
            res.status(400).json({ message: "location field needed" });
        }

        const exist = await Company.findOne({ opportunity });

        if (exist) {
            res.status(400).json({ message: "career opportunity already exists" });
        }
        const company = new Company(req.body);
        await company.save();
        res.status(201).json({ message: "Career opportunity created successfully " });
    } catch (err) {
        console.error("Error creating job");
        res.status(500).json({ message: "error creating job" });
    }
});

router.get('/getalljobs', async (req, res) => {
    try {
        const n = parseInt(req.query.n, 10); // may be undefined or NaN

        let query = Company.find({}, { opportunity: 1, _id: 0 });

        if (!isNaN(n)) {
            query = query.limit(n); // apply limit only if n is valid
        }

        const companies = await query;
        res.json(companies);
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).json({ message: "Server error" });
    }
});


router.get('/getjob/:opportunity', async (req, res) => {
    try {
        const opportunity = decodeURIComponent(req.params.opportunity);
        const job = await Company.findOne({
        opportunity: { $regex: new RegExp(`^${opportunity}$`, 'i') }
        });

        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
  

// router.post('/postjob', async (req, res) => {
//     try {
//         const companies = Array.isArray(req.body) ? req.body : [req.body];
//         const errors = [];

//         for (const company of companies) {
//             const { opportunity, location } = company;

//             if (!opportunity || !location) {
//                 errors.push({ opportunity, error: "Missing required fields" });
//                 continue;
//             }

//             const exists = await Company.findOne({ opportunity });
//             if (exists) {
//                 errors.push({ opportunity, error: "Already exists" });
//                 continue;
//             }
//             const newCompany = new Company(company);
//             await newCompany.save();
//         }

//         if (errors.length > 0) {
//             return res.status(207).json({ message: "Some entries failed", errors });
//         }

//         res.status(201).json({ message: "All companies added successfully" });

//     } catch (err) {
//         console.error("Bulk insert error:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

module.exports = router;