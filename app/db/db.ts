const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  estimatedFunding: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  fundsCollected: {
    type: Number,
    default: 0,
    min: 0
  },
  contributors: {
    type: Number,
    default: 0,
    min: 0
  },
  endDate: {
    type: Date,
    default: null
  },
  contractAddress: {
    type: String,
    default: null
  },
  transactionHash: {
    type: String,
    default: null
  },
  isFunded: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isFinalized: {
    type: Boolean,
    default: false
  },
  muralsSubmitted: {
    type: Number,
    default: 0,
    min: 0
  },
  totalVotesCast: {
    type: Number,
    default: 0,
    min: 0
  },
  winningMural: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

projectSchema.index({ location: 1 });
projectSchema.index({ isFunded: 1 });
projectSchema.index({ isCompleted: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;