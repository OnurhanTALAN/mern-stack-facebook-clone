import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(sessionStorage.getItem('token') || null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = (authToken, userData) => {
        setUser(userData);
        setToken(authToken);
        sessionStorage.setItem('token', authToken);
        sessionStorage.setItem('user', JSON.stringify(userData));
    }

    const logout = () => {
        setUser(null);
        setToken('');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/');
    }

    return(
        <AuthContext.Provider value={{ token, user, login, logout }}>
            { children }
        </AuthContext.Provider>
    );
}

export const useAuth = () => { return useContext(AuthContext) }