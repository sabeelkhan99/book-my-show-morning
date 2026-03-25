import React from 'react'
import { Card, Rate } from 'antd'
import { Link } from 'react-router'

const Movie = ({ movie }) => {
    const { _id, posterUrl, title, rating, genre } = movie

    return (
        <Link
            to={`/movies/${_id}`}
            style={{ textDecoration: 'none' }}
        >
            <Card
                hoverable
                cover={
                    <div style={{ aspectRatio: '2/3', overflow: 'hidden' }}>
                        <img
                            alt={title}
                            src={posterUrl}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                            }}
                        />
                    </div>
                }
                styles={{
                    body: { padding: '8px 10px' },
                }}
            >
                <div style={{ fontWeight: 600, fontSize: 'clamp(12px, 2.5vw, 16px)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <Rate disabled allowHalf value={rating ? rating / 2 : 0} style={{ fontSize: 12 }} />
                    <span style={{ fontSize: 12, color: '#666' }}>
                        {rating?.toFixed(1) || 'N/A'}
                    </span>
                </div>
                {genre && (
                    <div style={{ marginTop: 4, fontSize: 12, color: '#888' }}>
                        {typeof genre === 'string' ? genre : genre?.join?.(', ')}
                    </div>
                )}
            </Card>
        </Link>
    )
}

export default Movie
