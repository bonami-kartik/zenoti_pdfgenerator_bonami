import React, { useContext, useState } from 'react';
import { getItemFromStorage } from '../utils/helper';

const AuthContext = React.createContext({
    isLoggedIn: false,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = (props) => {
    const user = getItemFromStorage('user') ? getItemFromStorage('user') : {};
    const [authUser, setAuthUser] = useState(user);
    const [isloggedIn, setIsLoggedIn] = useState(
        !!(user && user.username && user.token),
    );

    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false);

    return (
        <AuthContext.Provider
            value={{ isloggedIn, login, logout, authUser, setAuthUser }}
            {...props}
        />
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
