const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    projectTitle: {
      type: String,
      required: true
    },
    projectOwnerName: {
      type: String,
      default: ''
    },
    projectOwnerEmail: {
      type: String,
      default: ''
    },
    applicant: {
      type: mongoose.Schema.Types.Mixed,
      required: false
    },
    applicantName: {
      type: String,
      required: true
    },
    applicantEmail: {
      type: String,
      required: true
    },
    roleApplied: {
      type: String,
      required: true
    },
    pitch: {
      type: String,
      required: [true, 'Application pitch is required'],
      maxlength: [500, 'Pitch cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Application', ApplicationSchema);
