const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: String,
  emergencyContact: {
    name: String,
    phone: String
  },
  membershipType: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Annual'],
    required: true,
    default: 'Monthly'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended', 'Expired'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);