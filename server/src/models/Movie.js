const mongoose = require('mongoose');

// https://mongoosejs.com/docs/schematypes.html

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 30,
        trim: true
    },
    posterUrl: String,
    genre: String,
    runtime: Number,
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    description: String,
    cast: [
        {
            name: String,
            alias: String,
            profilePicture: String
        }
    ]
}, {timestamps: true});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;