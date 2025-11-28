import React, { createContext, useState, useEffect } from 'react';
import API from '../api/api'; 
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to fetch the user's data from the backend
    const loadUser = async () => {
        if (token) {
            try {
                // Uses the API client, which automatically sends the token
                const res = await API.get('/auth/'); 
                setUser(res.data);
                setIsAuthenticated(true);
            } catch (err) {
                // Token is invalid, expired, or server error. Log out user.
                console.error('Token validation failed. Logging out.', err);
                localStorage.removeItem('token');
                setToken(null);
                setIsAuthenticated(false);
                setUser(null);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]); // Rerun when token changes (login/logout)


    const login = async (formData) => {
        try {
            // Uses API, but bypasses the interceptor for this public route
            const res = await axios.post('http://localhost:5000/api/auth/login', formData); 
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            // isAuthenticated will be set to true and loadUser will run in useEffect
            return { success: true };
        } catch (err) {
            console.error(err.response.data);
            return { success: false, message: err.response.data.message || 'Login failed.' };
        }
    };

    const register = async (formData) => {
        try {
            // Uses API, but bypasses the interceptor for this public route
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            // isAuthenticated will be set to true and loadUser will run in useEffect
            return { success: true };
        } catch (err) {
            console.error(err.response.data);
            return { success: false, message: err.response.data.message || 'Registration failed.' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
        setUser(null); // <-- Clear user object
    };

    const value = {
        token,
        isAuthenticated,
        loading,
        user, // <-- Expose the user object
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};