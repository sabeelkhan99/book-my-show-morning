import React, { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { message, Spin } from 'antd'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'

// This is your test publishable API key.
const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
)

const Checkout = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const bookingId = location.state?.bookingId
    const amount = location.state?.amount

    const fetchClientSecret = useCallback(async () => {
        if (!bookingId || !amount) {
            message.error('Missing booking information for payment. Please start again.')
            navigate('/')
            return ''
        }

        try {
            const res = await fetch('http://localhost:8080/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    method: 'CARD',
                    amount,
                    bookingId,
                }),
            })

            const data = await res.json()

            if (!data.success) {
                throw new Error(data.message || 'Failed to create payment session')
            }

            return data.payload?.clientSecret || ''
        } catch (err) {
            console.error(err)
            message.error(err.message || 'Unable to start payment. Please try again.')
            navigate(-1)
            return ''
        }
    }, [amount, bookingId, navigate])

    const options = {
        fetchClientSecret,
    }

    if (!bookingId || !amount) {
        return (
            <div style={{ padding: 24, textAlign: 'center' }}>
                <Spin />
            </div>
        )
    }

    return (
        <div style={{ maxWidth: 800, margin: '24px auto' }}>
            <h2 style={{ marginBottom: 16 }}>Complete your payment</h2>
            <p style={{ marginBottom: 16 }}>Amount to pay: <strong>{amount}</strong></p>
            <div id="checkout">
                <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                    <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
            </div>
        </div>
    )
}

export default Checkout

