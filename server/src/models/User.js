const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Partner', 'User'],
        default: 'User'
    },
    resetPasswordToken: {
        type: String,
        index: true
    },
    resetPasswordExpiry: Number
}, { versionKey: false, timestamps: true });

userSchema.methods.isPartner = function() {
    return this.role === 'Partner';
}

userSchema.methods.isAdmin = function() {
    return this.role === 'Admin';
}

const User = mongoose.model('User', userSchema);

module.exports = User;