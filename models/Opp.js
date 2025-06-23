const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  opportunity: { type: String, required: true },
  company: { type: String, required: true },
  description: {type: String},
  type: { type: String, enum: ['Job', 'Internship', 'Summer Internship'], required: true },
  category: { type: String }, // e.g., "Computer Science"
  technologies: [String],     // ["React", "MongoDB"]
  tags: [String],             // ["Teamwork", "Agile"]
  eligibility: { type: String },
  location: { type: String },
  mode: { type: String, enum: ['Remote', 'Onsite', 'Hybrid'] },
  duration: { type: String },
  stipend: { type: String },
  annual_salary_min: { type: Number },
  annual_salary_max: {
    type: Number,
    validate: {
      validator: function (v) {
        return !v || v >= this.annual_salary_min;
      },
      message: props => `Max salary must be >= min`
    }
  },
  work_details: { type: String },
  last_date: { type: Date },
  application_url: { type: String },
  contact_email: { type: String },
  is_active: { type: Boolean, default: true },

  applied: { type: Number, default: 0 },
  logo_url: { type: String } // e.g., https://company.com/logo.png

}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);