import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaBell, FaCheckCircle, FaDonate, FaFolder } from 'react-icons/fa'; // Icons for notification types


const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view notifications');
          setLoading(false);
          return;
        }

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications`, {
          headers: { 'x-auth-token': token },
          credentials: 'include',
        });

        setNotifications(res.data);
      } catch (err) {
        setError('Failed to fetch notifications');
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Set up Socket.IO for real-time notifications
  useEffect(() => {
    if (!user) return;

    const newSocket = io(process.env.REACT_APP_API_URL, {
      auth: { token: localStorage.getItem('token') },
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      newSocket.emit('join', user.id);
    });

    newSocket.on('notification', (notification) => {
      setNotifications((prev) => {
        const exists = prev.find((n) => n._id === notification._id);
        if (exists) {
          return prev.map((n) => (n._id === notification._id ? notification : n));
        }
        return [notification, ...prev];
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Mark a single notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/notifications/${notificationId}/read`,
        {},
        {
          headers: { 'x-auth-token': token },
          credentials: 'include',
        }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: res.data.read } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err.message);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const unreadNotifications = notifications.filter((n) => !n.read);
      if (unreadNotifications.length === 0) return;

      // Batch update all unread notifications
      await Promise.all(
        unreadNotifications.map((notification) =>
          axios.put(
            `${process.env.REACT_APP_API_URL}/api/notifications/${notification._id}/read`,
            {},
            {
              headers: { 'x-auth-token': token },
              credentials: 'include',
            }
          )
        )
      );

      setNotifications((prev) =>
        prev.map((n) => (n.read ? n : { ...n, read: true }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err.message);
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'drive':
        return <FaFolder className="notification-icon drive" />;
      case 'approval':
        return <FaCheckCircle className="notification-icon approval" />;
      case 'donation':
        return <FaDonate className="notification-icon donation" />;
      default:
        return <FaBell className="notification-icon default" />;
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>
          <FaBell className="header-icon" /> Notifications
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </h1>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="mark-all-read-btn">
            Mark All as Read
          </button>
        )}
      </div>
      {notifications.length > 0 ? (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className={`notification-card ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <div className="notification-icon-wrapper">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-details">
                  <p className="notification-message">{notification.message}</p>
                  <small className="notification-timestamp">
                    {new Date(notification.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="mark-read-btn"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-notifications">No notifications to display.</p>
      )}
    </div>
  );
};

export default Notifications;