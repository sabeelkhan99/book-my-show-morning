import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Alert, Button, Spin } from 'antd'

const PaymentReturn = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [status, setStatus] = useState(null)
    const [message, setMessage] = useState('')
    const [payment, setPayment] = useState(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const sessionId = urlParams.get('session_id')

        if (!sessionId) {
            setError('Missing Stripe session information.')
            setIsLoading(false)
            return
        }

        const fetchStatus = async () => {
            try {
                const res = await fetch(`http://localhost:8080/payments/${sessionId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })

                const data = await res.json()

                if (!data.success) {
                    throw new Error(data.message || 'Failed to fetch payment status')
                }

                const payload = data.payload || {}
                setStatus(payload.status || 'complete')
                setPayment(payload.payment || null)
                setMessage(payload.message || 'Payment completed successfully')
            } catch (err) {
                console.error(err)
                setError(err.message || 'Something went wrong while checking payment status.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchStatus()
    }, [])

    if (isLoading) {
        return (
            <div style={{ padding: 24, textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
                <Alert
                    message="Payment failed"
                    description={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
                <Button type="primary" onClick={() => navigate('/')}>
                    Go back to home
                </Button>
            </div>
        )
    }

    return (
        <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
            <Alert
                message={status === 'complete' ? 'Payment successful' : 'Payment status'}
                description={message}
                type={status === 'complete' ? 'success' : 'info'}
                showIcon
                style={{ marginBottom: 16 }}
            />

            {payment && (
                <div style={{ marginBottom: 24 }}>
                    <h3>Payment details</h3>
                    <p>
                        <strong>Payment ID:</strong> {payment._id}
                    </p>
                    <p>
                        <strong>Method:</strong> {payment.method}
                    </p>
                    <p>
                        <strong>Amount:</strong> {payment.amount}
                    </p>
                    <p>
                        <strong>Status:</strong> {payment.status}
                    </p>
                </div>
            )}

            <Button type="primary" onClick={() => navigate('/')}>
                Go back to home
            </Button>
        </div>
    )
}

export default PaymentReturn

