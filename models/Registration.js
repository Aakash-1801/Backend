const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  fullName: { type: String},
  email: { type: String},
  phone: { type: String},
  // dob: { type: String},
  gender: { type: String},
  qualification: { type: String},
  stream: { type: String},
  cgpa: { type: Number, min: 0, max: 10 },
  opportunity: { type: String},
  // resume: { type: String},
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);