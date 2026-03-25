const mongoose = require('mongoose');

const screeningSchema = new mongoose.Schema({
    theatre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theatre'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    },
    price: {
        type: Number,
        min: 0
    },
    showTimings: [
        {
            type: String, 
            required: true
        }
    ] //["3:00PM", "6:00PM"]
}, { timestamps: true });

const Screening = mongoose.model('Screening', screeningSchema);

module.exports = Screening;