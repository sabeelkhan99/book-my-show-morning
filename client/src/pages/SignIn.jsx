import React, { useContext } from 'react'
import { Form, Input, Button, Card } from 'antd'
import { Link } from 'react-router'
import UserContext from '../context/user-context'

const SignIn = () => {
    const [form] = Form.useForm();
    const { login } = useContext(UserContext);


    const onFinish = (values) => {
        console.log('Sign in:', values)
        // API logic to be added later
        login(values)
    }

    return (
        <div style={{ maxWidth: 400, margin: '48px auto', padding: '0 16px' }}>
            <Card title="Sign In">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
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

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Sign In
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginBottom: 8 }}>
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </Form>
            </Card>
        </div>
    )
}

export default SignIn
