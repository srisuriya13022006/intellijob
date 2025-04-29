const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Changed from job_id to id
  title: { type: String, required: true },
  company: { type: String },
  location: { type: String },
  type: { type: String },
  postedDate: { type: String },
  salary: { type: String },
  description: { type: String },
  requirements: [String],
  skills: [String],
  job_url: { type: String },
  logo: { type: String },
  fetchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);