const express = require('express');
const User = require('../models/User');
const { BadRequestError, NotFoundError } = require('../core/ApiError');
const bcrypt = require('bcrypt');
const ApiResponse = require('../core/ApiResponse');
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('../middlewares/user');
const crypto = require('crypto');
const MailgunClient = require('../lib/MailgunClient');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async(req, res) => {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw new BadRequestError('User with this email is already registered');
    }
    const hash = await bcrypt.hash(password, 12);
    const newUser = new User({ email, password: hash, role });
    await newUser.save();
    res.json(ApiResponse.build(true, { email: newUser.email, role: newUser.role }, 'User created successfully'));
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // check if user with email exist
    const user = await User.findOne({ email });
    if (!user) {
        throw new BadRequestError('Username or password is incorrect');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new BadRequestError('Username or password is incorrect')
    }

    // sign the token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {expiresIn: 3 * 24 * 60 *60});

    res.json(ApiResponse.build(true, { token }, 'LoggedIn Successfully'));
});

router.get('/profile', isLoggedIn, async (req, res) => {
    const { userId } = req;
    const user = await User.findById(userId).select('-password');
    res.json(ApiResponse.build(true, { email: user.email, role: user.role }, 'User profile'));
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new BadRequestError('Invalid Email');
    }

    // generate and save the token to the user
    const token = crypto.randomBytes(8).toString('hex');

    // We can hash the token and store so that if db is compromised, token values are not exposed.
    user.resetPasswordToken = token;
    user.resetPasswordExpiry = new Date().getTime() + 10 * 60 * 1000;

    await user.save();

    // generate password reset url
    const url = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${token}`;
    console.log(url);

    // send url via email to the user
    const emailText = `
    Hi 👋
    Please click on the following link to reset the password ${url}.
    `
    await MailgunClient.sendEmail(user.email, 'Reset Password', emailText);

    res.json(ApiResponse.build(true, 'reset password link sent', 'reset password link sent'));
});

router.post('/reset-password', async (req, res) => {
    const { password, token } = req.body;

    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
        throw new NotFoundError('User not found');
    }

    // if user is found, then token is valid but we need to check the expiry.

    if (new Date().getTime() > user.resetPasswordExpiry) {
        throw new BadRequestError('Token has expired');
    }

    const newHash = await bcrypt.hash(password, 12);

    user.password = newHash;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;

    await user.save();

    res.json(ApiResponse.build(true, 'Password reset successfully', 'password reset successfully'));
});

module.exports = router;