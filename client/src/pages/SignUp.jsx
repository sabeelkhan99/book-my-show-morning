import React, { useEffect } from 'react'
import { Form, Input, Button, Card, Select, message } from 'antd'
import { Link, useNavigate } from 'react-router'
import { registerUser } from '../lib/apis';
import useHttp from '../hooks/useHttp';

const SignUp = () => {
    const [form] = Form.useForm();

    const navigate = useNavigate();

    const { data, isLoading, error, sendRequest } = useHttp(registerUser, false);

    useEffect(() => {
        if (data) {
            message.success('Registration successful. Please sign in.');
            navigate('/signin');
        }
    }, [data, navigate]);

    const onFinish = (values) => {
        sendRequest(values);
    }

    return (
        <div style={{ maxWidth: 400, margin: '48px auto', padding: '0 16px' }}>
            <Card title="Sign Up">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ role: 'User' }}
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select
                            placeholder="Select role"
                            options={[
                                { value: 'User', label: 'User' },
                                { value: 'Partner', label: 'Partner' }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Sign Up
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        Already have an account? <Link to="/signin">Sign In</Link>
                    </div>
                </Form>
            </Card>
        </div>
    )
}

export default SignUp
