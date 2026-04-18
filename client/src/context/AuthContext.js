import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// Create the AuthContext with a default value to avoid undefined errors
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

  // Initialize user and socket on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: { 'x-auth-token': token },
        })
        .then(res => {
          setUser(res.data);
          localStorage.setItem('userId', res.data.id); // Store userId for notifications
        })
        .catch(err => {
          console.error('Error fetching user:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    const newSocket = io(process.env.REACT_APP_API_URL); // Use API URL for socket connection
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  // Set up socket listeners when user and socket are ready
  useEffect(() => {
    if (user && socket) {
      socket.emit('join', user.id); // Use 'id' as per the User model
      socket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });
    }
  }, [user, socket]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      const token = res.data.token;
      localStorage.setItem('token', token);

      const userData = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        headers: { 'x-auth-token': token },
      });
      setUser(userData.data);
      localStorage.setItem('userId', userData.data.id);
    } catch (err) {
      console.error('Login error:', {
        message: err.message,
        response: err.response?.data || 'No response data',
        status: err.response?.status,
      });
      throw err;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      console.log('Registering user - Request:', { name, email, password, role, url: `${process.env.REACT_APP_API_URL}/api/auth/register` });
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { name, email, password, role });
      console.log('Registration response:', res.data);
      const token = res.data.token;
      localStorage.setItem('token', token);

      const userData = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        headers: { 'x-auth-token': token },
      });
      setUser(userData.data);
      localStorage.setItem('userId', userData.data.id);
    } catch (err) {
      console.error('Registration error - Details:', {
        message: err.message,
        response: err.response?.data || 'No response data',
        status: err.response?.status,
        config: err.config,
      });
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    setNotifications([]);
    if (socket) {
      socket.disconnect();
      setSocket(io(process.env.REACT_APP_API_URL)); // Reconnect for future logins
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, notifications, loading }}>
      {children}
    </AuthContext.Provider>
  );
};