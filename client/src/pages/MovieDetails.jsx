import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Row, Col, Rate, Spin, Alert, Button, Card, Avatar, Tag, Divider, Empty, Modal, message, Radio } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import useHttp from '../hooks/useHttp'
import { fetchMovieById, fetchScreeningsByMovieId, createBooking } from '../lib/apis'

const MovieDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [isSeatModalOpen, setIsSeatModalOpen] = useState(false)
    const [selectedTheatre, setSelectedTheatre] = useState(null)
    const [selectedScreening, setSelectedScreening] = useState(null)
    const [selectedShowTime, setSelectedShowTime] = useState(null)
    const [selectedSeats, setSelectedSeats] = useState([])
    const { data: movie, error, isLoading, sendRequest } = useHttp(fetchMovieById, true)
    const {
        data: screeningsPayload,
        error: theatresError,
        isLoading: theatresLoading,
        sendRequest: sendFetchScreeningsRequest,
    } = useHttp(fetchScreeningsByMovieId, true)
    
    const {
        data: booking,
        isLoading: isCreatingBooking,
        error: bookingError,
        sendRequest: sendCreateBooking,
    } = useHttp(createBooking)

    useEffect(() => {
        if (id) {
            sendRequest(id)
            sendFetchScreeningsRequest(id)
        }
    }, [id])

    const seatRows = ['A', 'B', 'C', 'D', 'E', 'F']
    const seatColumns = [1, 2, 3, 4, 5, 6, 7, 8, 9]

    const findScreeningForTheatre = (theatreId) => {
        const allScreenings = screeningsPayload?.screenings || []
        return allScreenings.find((s) => {
            const screeningTheatreId = s?.theatre?._id || s?.theatre
            return String(screeningTheatreId) === String(theatreId)
        })
    }

    const handleOpenSeatModal = (theatre) => {
        const screening = findScreeningForTheatre(theatre._id)

        if (!screening) {
            message.error('No screenings found for this theatre')
            return
        }

        setSelectedTheatre(theatre)
        setSelectedScreening(screening)
        setSelectedShowTime(screening.showTimings?.[0] || null)
        setSelectedSeats([])
        setIsSeatModalOpen(true)
    }

    const toggleSeatSelection = (seatCode) => {
        setSelectedSeats((prev) =>
            prev.includes(seatCode) ? prev.filter((s) => s !== seatCode) : [...prev, seatCode]
        )
    }

    const handleCreateBooking = async () => {
        if (!selectedTheatre || !selectedScreening) {
            message.error('Invalid booking details')
            return
        }

        if (!selectedShowTime) {
            message.warning('Please select a show time')
            return
        }

        if (selectedSeats.length === 0) {
            message.warning('Please select at least one seat')
            return
        }

        const amount = (selectedScreening.price || 0) * selectedSeats.length

        await sendCreateBooking({
            theatreId: selectedTheatre._id,
            movieId: id,
            seats: selectedSeats,
            showTime: selectedShowTime,
            amount,
        })

        if (bookingError) {
            message.error(bookingError || 'Failed to create booking')
            return
        }

        if (!booking?._id) {
            message.error('Booking response missing. Please try again.')
            return
        }

        message.success('Booking created successfully')
        setIsSeatModalOpen(false)
        setSelectedSeats([])

        navigate('/checkout', {
            state: {
                bookingId: booking._id,
                amount,
            },
        })
    }

    if (isLoading) {
        return (
            <div style={{ padding: '24px 8px', maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ marginBottom: 16 }}>
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        style={{ paddingLeft: 0 }}
                    >
                        Back
                    </Button>
                </div>
                <div style={{ minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin size="large" description="Loading movie details..." />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ padding: '24px 8px', maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ marginBottom: 16 }}>
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        style={{ paddingLeft: 0 }}
                    >
                        Back
                    </Button>
                </div>
                <Alert
                    message="Unable to load movie"
                    description={error}
                    type="error"
                    showIcon
                />
            </div>
        )
    }

    if (!movie) {
        return null
    }

    const { title, posterUrl, runtime, rating, description, cast } = movie

    return (
        <div style={{ padding: '24px 8px 32px', maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    style={{ paddingLeft: 0 }}
                >
                    Back
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={9}>
                    <div
                        style={{
                            borderRadius: 8,
                            overflow: 'hidden',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                            maxWidth: 320,
                            marginInline: 'auto',
                        }}
                    >
                        <div style={{ aspectRatio: '2/3', background: '#111' }}>
                            <img
                                src={posterUrl}
                                alt={title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                        </div>
                    </div>
                </Col>

                <Col xs={24} md={15}>
                    <h1
                        style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                            marginBottom: 8,
                        }}
                    >
                        {title}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Rate
                                disabled
                                allowHalf
                                value={rating ? rating / 2 : 0}
                                style={{ fontSize: 18 }}
                            />
                            <span style={{ fontSize: 14, color: '#666' }}>
                                {rating?.toFixed(1) || 'N/A'} / 10
                            </span>
                        </div>
                        {runtime && (
                            <Tag color="magenta">
                                {runtime} mins
                            </Tag>
                        )}
                    </div>

                    {description && (
                        <p
                            style={{
                                fontSize: 14,
                                lineHeight: 1.6,
                                color: '#444',
                                marginBottom: 20,
                            }}
                        >
                            {description}
                        </p>
                    )}
                </Col>
            </Row>

            {cast && cast.length > 0 && (
                <div style={{ marginTop: 32 }}>
                    <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', marginBottom: 16 }}>
                        Cast
                    </h2>
                    <Row gutter={[16, 16]}>
                        {cast.map((member) => (
                            <Col key={member._id || member.name} xs={12} sm={8} md={6}>
                                <Card
                                    hoverable
                                    styles={{
                                        body: { padding: 12, textAlign: 'center' },
                                    }}
                                >
                                    <Avatar
                                        src={member.profilePicture}
                                        alt={member.name}
                                        size={72}
                                        style={{ marginBottom: 8 }}
                                    />
                                    <div style={{ fontWeight: 600, fontSize: 13 }}>
                                        {member.name}
                                    </div>
                                    {member.alias && (
                                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                                            as {member.alias}
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            <Divider style={{ marginTop: 32, marginBottom: 20 }} />

            <div style={{ marginTop: 8 }}>
                <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', marginBottom: 16 }}>
                    Theatres screening this movie
                </h2>

                {theatresLoading && (
                    <div style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Spin description="Loading theatres..." />
                    </div>
                )}

                {theatresError && (
                    <Alert
                        message="Unable to load theatres"
                        description={theatresError}
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {!theatresLoading && !theatresError && (
                    <>
                        {((screeningsPayload?.theatres || []).length === 0) ? (
                            <Empty description="No theatres are screening this movie yet." />
                        ) : (
                            <Row gutter={[12, 12]}>
                                {(screeningsPayload?.theatres || []).map((t) => (
                                    <Col key={t._id} xs={24} md={12}>
                                        <Card
                                            hoverable
                                            styles={{ body: { padding: 14 } }}
                                            title={t.name}
                                            extra={<Tag color="blue">{t.capacity ? `Capacity: ${t.capacity}` : 'Theatre'}</Tag>}
                                        >
                                            <div style={{ color: '#555', marginBottom: 10 }}>
                                                <div>{t.address || '-'}</div>
                                                <div>Contact: {t.contactNo || '-'}</div>
                                            </div>
                                            <Button type="primary" onClick={() => handleOpenSeatModal(t)}>
                                                Book ticket
                                            </Button>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </>
                )}
            </div>

            <Modal
                open={isSeatModalOpen}
                title={selectedTheatre ? `Select seats - ${selectedTheatre.name}` : 'Select seats'}
                onCancel={() => setIsSeatModalOpen(false)}
                onOk={handleCreateBooking}
                okText="Confirm Booking"
                confirmLoading={isCreatingBooking}
                width={600}
            >
                {selectedScreening && (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ marginBottom: 8, fontWeight: 500 }}>Show time</div>
                            <Radio.Group
                                value={selectedShowTime}
                                onChange={(e) => setSelectedShowTime(e.target.value)}
                            >
                                {(selectedScreening.showTimings || []).map((st) => (
                                    <Radio key={st} value={st}>
                                        {st}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </div>
                        <div style={{ marginBottom: 8, fontWeight: 500 }}>Select seats</div>
                        <div
                            style={{
                                display: 'inline-block',
                                padding: 12,
                                borderRadius: 8,
                                border: '1px solid #eee',
                                background: '#fafafa',
                            }}
                        >
                            <div style={{ fontSize: 12, marginBottom: 8, textAlign: 'center', color: '#888' }}>
                                Screen this side
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {seatRows.map((row) => (
                                    <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 16, fontSize: 12, color: '#666' }}>{row}</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 6 }}>
                                            {seatColumns.map((col) => {
                                                const seatCode = `${row}${col}`
                                                const isSelected = selectedSeats.includes(seatCode)
                                                return (
                                                    <button
                                                        key={seatCode}
                                                        type="button"
                                                        onClick={() => toggleSeatSelection(seatCode)}
                                                        style={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: 4,
                                                            border: isSelected ? '2px solid #1677ff' : '1px solid #ccc',
                                                            background: isSelected ? '#e6f4ff' : '#fff',
                                                            fontSize: 11,
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        {col}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginTop: 16, fontSize: 13 }}>
                            <div>Selected seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</div>
                            <div>
                                Total amount:{' '}
                                <strong>
                                    {(selectedScreening.price || 0) * selectedSeats.length}
                                </strong>
                            </div>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    )
}

export default MovieDetails

