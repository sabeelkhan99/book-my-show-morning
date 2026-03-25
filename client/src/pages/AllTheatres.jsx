import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, List, Spin, Alert, Tag } from 'antd';
import useHttp from '../hooks/useHttp';
import { fetchTheatres } from '../lib/apis';

const AllTheatres = () => {
    const { data, error, isLoading, sendRequest } = useHttp(fetchTheatres, true);
    const navigate = useNavigate();

    useEffect(() => {
        sendRequest();
    }, []);

    const theatres = data?.theatres || [];

    return (
        <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 16px' }}>
            <Card title="All Theatres">
                {isLoading && <Spin />}
                {error && (
                    <Alert
                        type="error"
                        message={error || 'Failed to load theatres'}
                        style={{ marginBottom: 16 }}
                    />
                )}
                {!isLoading && !error && (
                    <List
                        dataSource={theatres}
                        locale={{ emptyText: 'No theatres available' }}
                        renderItem={(item) => (
                            <List.Item
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/theatres/${item._id}`)}
                            >
                                <List.Item.Meta
                                    title={
                                        <span>
                                            {item.name}{' '}
                                            <Tag color="blue">Capacity: {item.capacity}</Tag>
                                        </span>
                                    }
                                    description={
                                        <>
                                            <div>{item.address}</div>
                                            <div>Contact: {item.contactNo}</div>
                                        </>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </div>
    );
};

export default AllTheatres;

