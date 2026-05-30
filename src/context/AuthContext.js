import { createContext, useContext, useState } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));

  const login = async (username, password) => {
    const res = await api.post('/login', { username, password });
    const jwt = res.data;
    sessionStorage.setItem('token', jwt);
    setToken(jwt);
    return jwt;
  };

  const register = async (email, username, password) => {
    const res = await api.post('/register', { email, username, password });
    return res.data;
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
