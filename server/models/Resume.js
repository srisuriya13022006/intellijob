// const mongoose = require('mongoose');

// const resumeSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   fileName: { type: String, required: true },
//   filePath: { type: String, required: true },
//   fileType: { type: String, required: true },
//   fileSize: { type: Number, required: true }, // in MB
//   parsedContent: {
//     skills: [String],
//     experience: [{
//       company: String,
//       title: String,
//       startDate: String,
//       endDate: String,
//       description: String,
//     }],
//     education: [{
//       institution: String,
//       degree: String,
//       field: String,
//       startDate: String,
//       endDate: String,
//     }],
//   },
//   analysis: {
//     strengths: [{ label: String, value: Number }],
//     improvementAreas: [String],
//     skillGaps: [{ skill: String, priority: String }],
//   },
//   uploadedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Resume', resumeSchema);
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  filePath: { type: String },
  parsedContent: { type: String },
  skills: [String],
  analysis: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);