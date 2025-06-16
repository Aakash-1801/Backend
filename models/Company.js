const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  opportunity: { type: String, required: true },
  company: { type: String },
  description: { type: String },
  eligibility: { type: String },
  location: { type: String, required: true },
  annual_salary_min: { type: Number, min: 0 },
  annual_salary_max: {
    type: Number,
    min: 0,
    validate: {
      validator: function (v) {
        return v >= this.annual_salary_min;
      },
      message: props => `Maximum salary (${props.value}) must be greater than or equal to minimum salary`
    }
  },
  work_details: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);