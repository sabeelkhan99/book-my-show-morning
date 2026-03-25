const express = require('express');
const Theatre = require('../models/Theatre');
const ApiResponse = require('../core/ApiResponse');
const { isLoggedIn, isPartnerOrAdmin } = require('../middlewares/user');

const router = express.Router();

router.post('/theatres',isLoggedIn, isPartnerOrAdmin, async (req, res) => {
    const { name, capacity, address, contactNo } = req.body;
    const { userId } = req;
    const theatre = await Theatre.create({ name, capacity, address, contactNo, user: userId });
    res.json(ApiResponse.build(true, {theatre}, 'Theatre created successfully'));
});

router.get('/theatres',isLoggedIn, isPartnerOrAdmin, async (req, res) => {
    const theatres = await Theatre.find().populate({path: 'user', select: '-password'});
    res.json(ApiResponse.build(true, {theatres}, 'Theatres fetched successfully'));
});

router.get('/theatres/:id',isLoggedIn, isPartnerOrAdmin, async (req, res) => {
    const { id } = req.params;
    const theatre = await Theatre.findById(id).populate({path: 'user', select: '-password'});
    res.json(ApiResponse.build(true, theatre, 'Theatre fetched successfully'));
});

module.exports = router;