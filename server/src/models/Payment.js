const mongoose = require('mongoose');
const crypto = require('crypto');

const paymentSchema = new mongoose.Schema({
    txnId: {
        type: String,
        unique: true
    },
    userId: String,
    method: String,
    amount: Number,
    bookingId: String,
    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'CANCELLED'],
        default: 'PENDING'
    },
    sessionId: String
}, { timestamps: true });

// Middleware to add the txnId to the payment just before save
paymentSchema.pre('save', function () {
    if (!this.txnId) {
        this.txnId = "TXN"+crypto.randomBytes(6).toString('hex').toUpperCase();
    }
})

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;