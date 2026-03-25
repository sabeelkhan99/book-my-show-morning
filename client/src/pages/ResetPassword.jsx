import React, { useEffect, useMemo } from 'react'
import { Button, Card, Form, Input, message, Result } from 'antd'
import { Link, useNavigate, useSearchParams } from 'react-router'
import useHttp from '../hooks/useHttp'
import { resetPassword } from '../lib/apis'

const ResetPassword = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const token = useMemo(() => searchParams.get('token') || '', [searchParams])

    const { data, isLoading, error, sendRequest } = useHttp(resetPassword, false)

    useEffect(() => {
        if (error) message.error(error)
    }, [error])

    useEffect(() => {
        if (data) {
            message.success('Password reset successfully. Please sign in.')
            navigate('/signin')
        }
    }, [data, navigate])

    const onFinish = (values) => {
        sendRequest({ token, password: values.password })
    }

    if (!token) {
        return (
            <div style={{ maxWidth: 520, margin: '48px auto', padding: '0 16px' }}>
                <Result
                    status="warning"
                    title="Invalid reset link"
                    subTitle="Token is missing. Please request a new reset password link."
                    extra={[
                        <Link key="forgot" to="/forgot-password">
                            <Button type="primary">Go to Forgot Password</Button>
                        </Link>,
                    ]}
                />
            </div>
        )
    }

    return (
        <div style={{ maxWidth: 420, margin: '48px auto', padding: '0 16px' }}>
            <Card title="Reset Password">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="password"
                        label="New Password"
                        rules={[{ required: true, message: 'Please enter a new password' }]}
                    >
                        <Input.Password placeholder="Enter new password" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your new password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) return Promise.resolve()
                                    return Promise.reject(new Error('Passwords do not match'))
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Re-enter new password" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Reset password
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        Back to <Link to="/signin">Sign In</Link>
                    </div>
                </Form>
            </Card>
        </div>
    )
}

export default ResetPassword

