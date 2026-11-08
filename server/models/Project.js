const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Full Stack', 'Web Development', 'MERN Stack', 'Mobile Dev', 'AI / ML', 'General'],
      default: 'Full Stack'
    },
    skillsRequired: {
      type: [String],
      default: []
    },
    openRole: {
      type: String,
      required: [true, 'Open role is required'],
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    ownerName: {
      type: String,
      required: true,
      default: 'Anonymous Student'
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Completed'],
      default: 'Open'
    },
    image: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Virtual index for searching
ProjectSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);
