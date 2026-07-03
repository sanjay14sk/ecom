import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Validate or load profile info on refresh
      API.get('/users/profile')
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          // Token expired or invalid
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await API.post('/auth/signin', { username, password });
      const { token: jwt, id, email, roles } = res.data;
      localStorage.setItem('token', jwt);
      setToken(jwt);
      setUser({ id, username, email, roles });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Invalid username or password.',
      };
    }
  };

  const register = async (username, email, password, phone, address, role) => {
    try {
      await API.post('/auth/signup', { username, email, password, phone, address, role });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => {
    return user && user.roles && user.roles.includes('ROLE_ADMIN');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
