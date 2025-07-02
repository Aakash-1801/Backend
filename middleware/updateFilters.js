const FilterOptions = require('../models/FilterOption');

const updateFiltersMiddleware = async (req, res, next) => {
  try {
    const job = req.body;
    let filters = await FilterOptions.findOne();
    if (!filters) filters = new FilterOptions();
    const fields = ['type', 'mode', 'category', 'eligibility', 'location'];
    fields.forEach(field => {
      if (job[field] && !filters[field].includes(job[field])) {
        filters[field].push(job[field]);
      }
    });
    if (Array.isArray(job.tags)) {
      job.tags.forEach(tag => {
        if (!filters.tag.includes(tag)) {
          filters.tag.push(tag);
        }
      });
    }
    await filters.save();
    next();
  } catch (err) {
    console.error('Filter update error:', err);
    next();
  }
};

module.exports = updateFiltersMiddleware;