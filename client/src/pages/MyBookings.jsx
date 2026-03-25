import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card, List, Tag, Spin, Alert, Empty } from 'antd'
import useHttp from '../hooks/useHttp'
import { fetchMyBookings } from '../lib/apis'

const MyBookings = () => {
    const { data: bookings, isLoading, error, sendRequest } = useHttp(fetchMyBookings, true)
    const navigate = useNavigate()

    useEffect(() => {
        sendRequest()
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
            <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
                <Alert
                    message="Unable to load your bookings"
                    description={error}
                    type="error"
                    showIcon
                />
            </div>
        )
    }

    return (
        <div style={{ padding: '24px 8px', maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ marginBottom: 16 }}>My Bookings</h2>
            {!bookings || bookings.length === 0 ? (
                <Empty description="You have no bookings yet." />
            ) : (
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={bookings}
                    renderItem={(b) => (
                        <List.Item>
                            <Card
                                hoverable
                                onClick={() => navigate(`/movies/${b.movie?._id || b.movie}`)}
                                title={b.movie?.title || 'Movie'}
                                extra={<Tag color="blue">{b.status}</Tag>}
                            >
                                <p>
                                    <strong>Theatre:</strong> {b.theatre?.name || 'N/A'}
                                </p>
                                <p>
                                    <strong>Show time:</strong> {b.showTime}
                                </p>
                                <p>
                                    <strong>Seats:</strong> {Array.isArray(b.seats) ? b.seats.join(', ') : '-'}
                                </p>
                                <p>
                                    <strong>Amount:</strong> {b.amount}
                                </p>
                            </Card>
                        </List.Item>
                    )}
                />
            )}
        </div>
    )
}

export default MyBookings

