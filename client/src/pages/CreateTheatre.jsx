import React, { useEffect } from 'react';
import { Card, Form, Input, InputNumber, Button, message } from 'antd';
import { useNavigate } from 'react-router';
import useHttp from '../hooks/useHttp';
import { createTheatre } from '../lib/apis';

const CreateTheatre = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const { data, error, isLoading, sendRequest } = useHttp(createTheatre, false);

    useEffect(() => {
        if (data) {
            message.success('Theatre created successfully');
            navigate('/');
        }
    }, [data, navigate]);

    useEffect(() => {
        if (error) {
            message.error(error.message || 'Failed to create theatre');
        }
    }, [error]);

    const onFinish = (values) => {
        sendRequest(values);
    };

    return (
        <div style={{ maxWidth: 500, margin: '48px auto', padding: '0 16px' }}>
            <Card title="Create Theatre">
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter theatre name' }]}
                    >
                        <Input placeholder="Enter theatre name" />
                    </Form.Item>

                    <Form.Item
                        label="Capacity"
                        name="capacity"
                        rules={[{ required: true, message: 'Please enter capacity' }]}
                    >
                        <InputNumber
                            min={1}
                            style={{ width: '100%' }}
                            placeholder="Enter seating capacity"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please enter address' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Enter full address" />
                    </Form.Item>

                    <Form.Item
                        label="Contact Number"
                        name="contactNo"
                        rules={[{ required: true, message: 'Please enter contact number' }]}
                    >
                        <Input placeholder="Enter contact number" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Create Theatre
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateTheatre;

