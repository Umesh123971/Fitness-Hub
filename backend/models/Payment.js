const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Bank Transfer'],
    required: true
  },
  transactionId: String,
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Failed'],
    default: 'Completed'
  },
  renewalDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);