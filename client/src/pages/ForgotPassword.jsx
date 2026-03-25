import React, { useEffect } from 'react'
import { Button, Card, Form, Input, message } from 'antd'
import { Link } from 'react-router'
import useHttp from '../hooks/useHttp'
import { forgotPassword } from '../lib/apis'

const ForgotPassword = () => {
    const [form] = Form.useForm()
    const { data, isLoading, error, sendRequest } = useHttp(forgotPassword, false)

    useEffect(() => {
        if (error) message.error(error)
    }, [error])

    useEffect(() => {
        if (data) {
            message.success('Reset password link sent. Please check your email.')
            form.resetFields()
        }
    }, [data, form])

    const onFinish = (values) => {
        sendRequest(values)
    }

    return (
        <div style={{ maxWidth: 420, margin: '48px auto', padding: '0 16px' }}>
            <Card title="Forgot Password">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input placeholder="Enter your registered email" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Send reset link
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        Remembered your password? <Link to="/signin">Sign In</Link>
                    </div>
                </Form>
            </Card>
        </div>
    )
}

export default ForgotPassword

