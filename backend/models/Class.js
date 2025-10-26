const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  schedule: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  maxCapacity: {
    type: Number,
    required: true,
    default: 10
  },
  currentBookings: {
    type: Number,
    default: 0
  },
  durationMinutes: {
    type: Number,
    required: true
  },
  description: String,
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  }
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);