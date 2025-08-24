// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // null matlab user logged out hai

    const login = (userData) => {
        setUser(userData);
        // Yahan aap token ko localStorage me save kar sakte hain
    };

    const logout = () => {
        setUser(null);
        // Yahan aap localStorage se token remove kar sakte hain
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
