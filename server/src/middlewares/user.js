const { AuthenticationError, ForbiddenError } = require("../core/ApiError");
const jwt = require('jsonwebtoken');
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

const isLoggedIn = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        throw new AuthenticationError('Please login to continue');
    }
    const token = authHeader.replace("Bearer ", "");
    const {userId} = jwt.verify(token, JWT_SECRET);
    req.userId = userId;
    next();
}

const isPartnerOrAdmin = async(req, res, next) => {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!(user.isPartner() || user.isAdmin())) {
        throw new ForbiddenError('You are not allowed to access this')
    }
    next();
}

module.exports = {
    isLoggedIn,
    isPartnerOrAdmin
}