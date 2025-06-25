const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  fullName: { type: String},
  email: { type: String},
  phone: { type: String},
  gender: { type: String},
  type: { type: String},
  institute: { type: String },
  course: {type: String},
  branch: { type: String},
  cgpa: { type: Number, min: 0, max: 10 },
  opportunity: { type: String},
  resume: { type: String},
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);