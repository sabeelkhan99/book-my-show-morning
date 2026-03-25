import React, { useContext } from 'react'
import { Layout as AntLayout, Input, Button, Dropdown, Avatar } from 'antd'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router'
import UserContext from '../context/user-context'

const { Header, Content, Footer } = AntLayout

const AppLayout = (props) => {
    const { user, isAuthenticated, logout } = useContext(UserContext);
    const navigate = useNavigate();

    const profileItems = [
        {
            key: 'email',
            label: user?.email || 'No email',
        },
        {
            key: 'role',
            label: user?.role ? `Role: ${user.role}` : 'Role: N/A',
        },
        {
            key: 'my-bookings',
            label: 'My Bookings',
            onClick: () => navigate('/bookings'),
        },
    ];

    const canCreateTheatre = isAuthenticated && (user?.role === 'Admin' || user?.role === 'Partner');

    return (
        <AntLayout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#F84464',
                    padding: '0 12px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Link to="/" style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}>
                        BookMyShow
                    </Link>
                    {canCreateTheatre && <Link to="/theatres" style={{ color: '#fff', fontSize: 14 }}>
                        All Theatres
                    </Link>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Input
                        placeholder="Search..."
                        prefix={<SearchOutlined />}
                        style={{ width: 'min(280px, 40vw)' }}
                    />
                    {canCreateTheatre && (
                        <Link to="/theatres/new">
                            <Button
                                type="default"
                                size="small"
                                style={{
                                    background: '#fff',
                                    color: '#F84464',
                                    fontWeight: 500,
                                }}
                            >
                                Create Theatre
                            </Button>
                        </Link>
                    )}
                    {isAuthenticated ? (
                        <>
                            <Dropdown
                                menu={{ items: profileItems }}
                                placement="bottomRight"
                                arrow
                            >
                                <Avatar
                                    size="large"
                                    icon={<UserOutlined />}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: '#fff',
                                        color: '#F84464',
                                        border: '2px solid rgba(255,255,255,0.85)',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                                    }}
                                />
                            </Dropdown>
                            <Button
                                type="default"
                                size="small"
                                shape="round"
                                style={{
                                    background: '#fff',
                                    color: '#F84464',
                                    paddingInline: 16,
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.16)',
                                }}
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/signin">
                                <Button type="default" size="small" style={{ background: '#fff', color: '#F84464' }}>
                                    Sign In
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button type="default" size="small" style={{ background: '#fff', color: '#F84464' }}>
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </Header>
            <Content style={{ padding: '0 12px', background: '#fff' }}>
                {props.children}
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                    background: '#1A1A1A',
                    color: '#999',
                    padding: '16px 12px',
                }}
            >
                <div style={{ marginBottom: 16 }}>
                    <a href="#movies" style={{ color: '#fff', marginRight: 24 }}>
                        Movies
                    </a>
                    <a href="#events" style={{ color: '#fff', marginRight: 24 }}>
                        Events
                    </a>
                    <a href="#plays" style={{ color: '#fff', marginRight: 24 }}>
                        Plays
                    </a>
                    <a href="#sports" style={{ color: '#fff' }}>
                        Sports
                    </a>
                </div>
                <div style={{ fontSize: 12 }}>
                    © {new Date().getFullYear()} BookMyShow. All rights reserved.
                </div>
            </Footer>
        </AntLayout>
    )
}

export default AppLayout
