import React, { createContext, useEffect, useState } from 'react';
import useHttp from '../hooks/useHttp';
import { fetchProfile, loginUser } from '../lib/apis';
import { useNavigate } from 'react-router';

const UserContext = createContext({
    user: null,
    isAuthenticated: false,
    login: () => { },
    logout: () => { }
})

export const UserContextProvider = (props) => {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const { data, error, isLoading, sendRequest } = useHttp(loginUser, false);
    const {
        data: profile,
        error: profileError,
        isLoading: isProfileLoading,
        sendRequest: sendFetchProfile } = useHttp(fetchProfile, false);

    // Case 1:  When profile is loaded after login
    useEffect(() => {
        if (!isLoading && data) {
            localStorage.setItem("token", data.token);
            sendFetchProfile();
            navigate("/");
        }
    }, [data]);

    useEffect(() => {
        if (!isProfileLoading && profile) {
            setUser(profile);
        }
    }, [profile, isProfileLoading]);

    // Case 2: When profile needs to be fetched just after first render if valid token is present
    useEffect(() => {
        sendFetchProfile();
    }, []);

    const login = (userCreds) => {
        sendRequest(userCreds);
    }

    const logout = () => {
        localStorage.setItem('token', "");
        setUser(null);
    }

    const context = {
        user: user,
        isAuthenticated: user ? true : false,
        login: login,
        logout: logout
    }

    return (
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext
