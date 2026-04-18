const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  drive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drive',
    required: true,
  },
  type: {
    type: String,
    enum: ['monetary', 'item'],
    default: 'monetary',
  },
  amount: {
    type: Number,
    required: function() { return this.type === 'monetary'; },
  },
  items: [{
    name: String,
    quantity: String
  }],
  paymentMethod: {
    type: String,
    required: function() { return this.type === 'monetary'; },
    enum: ['Razorpay', 'UPI', 'Credit Card', 'PayPal', 'N/A'],
  },
  transactionId: {
    type: String, // To store razorpay_payment_id
  },
  orderId: {
    type: String, // To store razorpay_order_id
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'delivered'],
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Donation', donationSchema);