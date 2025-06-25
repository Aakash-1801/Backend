const mongoose = require('mongoose');

const filterOptionsSchema = new mongoose.Schema({
  type: [String],       // e.g. ['Job', 'Internship']
  mode: [String],       // ['Remote', 'Hybrid']
  tag: [String],        // ['ML', 'Frontend']
  category: [String],   // ['Computer Science', 'Mechanical']
  eligibility: [String], // ['Student', 'Female Only']
  location: [String]    // ['Bangalore', 'PAN India']
});

module.exports = mongoose.model('FilterOptions', filterOptionsSchema);