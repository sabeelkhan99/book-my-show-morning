const express = require('express');
const Payment = require('../models/Payment');
const ApiResponse = require('../core/ApiResponse');
const Booking = require('../models/Booking');
const { isLoggedIn } = require('../middlewares/user');

// This is your test secret API key (move to env in production)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Stripe Documentation - https://docs.stripe.com/checkout/embedded/quickstart?client=react&lang=node
// Test card - Indian Test Visa Card: 4000 0035 6000 0008


router.post('/payments',isLoggedIn, async (req, res) => {
    const { method, amount, bookingId } = req.body;
    const { userId } = req;

    // 1. Create a payment record in DB
    const payment = await Payment.create({ method, amount, bookingId, userId });

    // 2. Create a Stripe Checkout Session (embedded)
    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Movie Ticket',
                    },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        metadata: {
            bookingId,
            paymentId: payment._id.toString(),
        },
        return_url: `${process.env.FRONTEND_BASE_URL}/payments/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    payment.sessionId = session.id;

    await payment.save();

    // 3. Return both our payment record and the Stripe client secret
    res.json(ApiResponse.build(true, { payment, clientSecret: session.client_secret, sessionId: session.id }, 'Payment created successfully')
    );
});

router.get('/payments/:sessionId', async (req, res) => {
        const { sessionId } = req.params;
    
        if (!sessionId) {
            throw new BadRequestError('sessionId is required');
        }
    
        const session = await stripe.checkout.sessions.retrieve(sessionId);
    
        const { bookingId, paymentId } = session.metadata || {};
    
        if (!bookingId || !paymentId) {
            throw new BadRequestError('Invalid session metadata');
        }
    
        const isPaid = session.payment_status === 'paid';
    
        const payment = await Payment.findByIdAndUpdate(
            paymentId,
            { status: isPaid ? 'PAID' : 'CANCELLED' },
            { returnDocument: 'after' }
        );
    
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: isPaid ? 'CONFIRMED' : 'CANCELLED' },
            { returnDocument: 'after' }
        );
    
        res.json(
            ApiResponse.build(
                true,
                {
                    payment,
                    booking,
                    stripeSession: {
                        id: session.id,
                        status: session.status,
                        paymentStatus: session.payment_status,
                    },
                },
                isPaid ? 'Payment successful' : 'Payment cancelled'
            )
        );
    });
    


module.exports = router;