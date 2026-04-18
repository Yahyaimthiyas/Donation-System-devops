import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import io from 'socket.io-client';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  notifications: [],
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
          localStorage.setItem('userId', res.data.data._id);
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();

    const newSocket = io(process.env.REACT_APP_API_URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (user && socket) {
      socket.emit('join', user._id);
      socket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });
    }
  }, [user, socket]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token } = res.data;
    localStorage.setItem('token', token);

    const userData = await api.get('/auth/me');
    setUser(userData.data.data);
    localStorage.setItem('userId', userData.data.data._id);
  };

  const register = async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    const { token } = res.data;
    localStorage.setItem('token', token);

    const userData = await api.get('/auth/me');
    setUser(userData.data.data);
    localStorage.setItem('userId', userData.data.data._id);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    setNotifications([]);
    if (socket) {
      socket.disconnect();
      setSocket(io(process.env.REACT_APP_API_URL));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, notifications, loading }}>
      {children}
    </AuthContext.Provider>
  );
};