const express = require('express');
const { isLoggedIn } = require('../middlewares/user');
const Booking = require('../models/Booking');
const { BadRequestError } = require('../core/ApiError');
const ApiResponse = require('../core/ApiResponse');

const router = express.Router();

router.post('/bookings', isLoggedIn, async (req, res) => {
  const { theatreId, movieId, amount, seats, showTime } = req.body;
  const { userId } = req;

  const existingBooking = await Booking.findOne({
    theatre: theatreId,
    movie: movieId,
    seats: { $in: [...seats] },
    showTime: showTime,
  });

  if (existingBooking) {
    throw new BadRequestError('Some of these seats are already booked');
  }

  const booking = await Booking.create({
    theatre: theatreId,
    movie: movieId,
    user: userId,
    amount: amount,
    seats: seats,
    showTime: showTime,
  });

  res.json(ApiResponse.build(true, booking, 'Booking created successfully'));
});

// Get all bookings for the logged‑in user
router.get('/bookings', isLoggedIn, async (req, res) => {
  const { userId } = req;

  const bookings = await Booking.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('movie', 'title posterUrl runtime')
    .populate('theatre', 'name address');

  res.json(ApiResponse.build(true, bookings, 'Bookings fetched successfully'));
});

module.exports = router;