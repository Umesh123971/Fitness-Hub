const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Completed'],
    default: 'Confirmed'
  }
}, { timestamps: true });

// Prevent duplicate bookings
bookingSchema.index({ memberId: 1, classId: 1, bookingDate: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);