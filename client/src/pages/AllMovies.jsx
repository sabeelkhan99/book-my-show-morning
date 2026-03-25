import React, { useEffect } from 'react'
import { Row, Col, Spin, Alert } from 'antd'
import Movie from '../components/Movie'
import { fetchMovies } from '../lib/apis'
import useHttp from '../hooks/useHttp'

const AllMovies = () => {
    const { data, error, isLoading, sendRequest } = useHttp(fetchMovies, true);

    useEffect(() => {
        sendRequest();
    }, []);

    return (
        <div style={{ padding: '16px 8px', maxWidth: 1200, margin: '0 auto' }}>
            {isLoading && (
                <div style={{ textAlign: 'center', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin size="large" description="Loading movies..." />
                </div>
            )}
            {error && (
                <Alert
                    message="Error loading movies"
                    description={error}
                    type="error"
                    showIcon
                />
            )}
            {!isLoading && !error && (
                <>
                    <h2 style={{ marginBottom: 16, fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
                        Movies in Theatres
                    </h2>
                    <Row gutter={[12, 16]}>
                        {data &&
                            data.map((movie) => (
                                <Col key={movie._id} xs={12} sm={12} md={8} lg={6}>
                                    <Movie movie={movie} />
                                </Col>
                            ))}
                    </Row>
                </>
            )}
        </div>
    )
}

export default AllMovies
