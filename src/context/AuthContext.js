import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for user data in local storage on initial load
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }, []);

    const login = (userData, token) => {
        // Ensure is_verified flag is part of the user object
        const userToStore = {
            ...userData,
            is_verified: userData.is_verified === 1 || userData.is_verified === true,
        };
        setUser(userToStore);
        localStorage.setItem('user', JSON.stringify(userToStore));
        
        if (token) {
            localStorage.setItem('token', token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);