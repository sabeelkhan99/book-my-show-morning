const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
    name: {
        type: String
    },
    address: String,
    contactNo: Number,
    capacity: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Theatre = mongoose.model('Theatre', theatreSchema);
module.exports = Theatre;