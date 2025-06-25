const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  opportunity: { type: String, required: true },
  company: { type: String, required: true },
  description: {type: String},
  type: { type: String, enum: ['Job', 'Internship', 'Summer Internship'], required: true },
  branch: {type: String},  // e.g., "Computer Science", "electrical"
  category: { type: String },  // frontend,backend etc
  technologies: [String],     // ["React", "MongoDB"]
  tags: [String],             // ["Teamwork", "Agile"]
  proffession: {type: String}, // student,some female only, working proffessional
  eligibility: { type: String },  // some more details company provide
  location: { type: String },  // specific location or pan india
  mode: { type: String, enum: ['Remote', 'Onsite', 'Hybrid', 'inOffice'] },
  duration: { type: String }, // fulltime, parttime
  stipend: { type: String }, //if internship
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
  work_details: { type: String },  // extra details ex 20 hrs/week | Duration: 3 months
  last_date: { type: Date },  // to participate
  application_url: { type: String },
  contact_email: { type: String },
  is_active: { type: Boolean, default: true },
  applied: { type: Number, default: 0 },
  logo_url: { type: String } // e.g., https://company.com/logo.png

}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);