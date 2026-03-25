const express = require('express');
const { isLoggedIn, isPartnerOrAdmin } = require('../middlewares/user');
const Screening = require('../models/Screening');
const ApiResponse = require('../core/ApiResponse');

const router = express.Router();

router.post('/screenings', isLoggedIn, isPartnerOrAdmin, async (req, res) => {
    const { theatreId, movieId, price, showTimings } = req.body;
    const { userId } = req;
    const screening = await Screening.create({ theatre: theatreId, movie: movieId, price, showTimings, author: userId });
    res.json(ApiResponse.build(true, screening, 'Screening created successfully'));
});

router.get('/screenings/:movieId', async(req, res) => {
    const { movieId } = req.params;
    const screenings = await Screening.find({ movie: movieId }).populate('theatre');

    const theatresById = new Map();
    for (const s of screenings) {
        if (s?.theatre?._id) {
            theatresById.set(String(s.theatre._id), s.theatre);
        }
    }
    const theatres = Array.from(theatresById.values());

    res.json(ApiResponse.build(true, { theatres, screenings }, 'All screenings for a movie'));
})


module.exports = router;