const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  specialization: [{
    type: String
  }],
  contact: {
    type: String,
    required: true
  },
  bio: String,
  certifications: [String],
  availability: [{
    day: String,
    startTime: String,
    endTime: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);