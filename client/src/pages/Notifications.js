import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  Heart, 
  Target, 
  BellRing, 
  Clock, 
  Trash2, 
  MailOpen,
  Mail,
  Filter
} from 'lucide-react';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        const data = res.data.data || res.data;
        setNotifications(data);
      } catch (err) {
        setError('Unable to fetch your activity feed.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!user) return;
    const newSocket = io(process.env.REACT_APP_API_URL, {
      auth: { token: localStorage.getItem('token') },
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join', user.id);
    });

    newSocket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev.filter(n => n._id !== notification._id)]);
    });

    return () => newSocket.disconnect();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      await Promise.all(unread.map(n => api.put(`/notifications/${n._id}/read`)));
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { console.error(err); }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'drive': return <Target size={20} className="text-primary" />;
      case 'approval': return <CheckCircle2 size={20} className="text-secondary" />;
      case 'donation': return <Heart size={20} style={{ color: '#ec4899' }} />;
      default: return <Bell size={20} className="text-muted" />;
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="fade-in" style={{ color: 'var(--primary)', fontWeight: '600' }}>Retrieving your feed...</div>
    </div>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div 
      className="page-transition-wrapper container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '80px', maxWidth: '800px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>
            <BellRing size={18} /> UPDATES
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Notifications
            {unreadCount > 0 && <span style={{ fontSize: '12px', background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '20px' }}>{unreadCount} New</span>}
          </h1>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="btn-primary" 
            style={{ padding: '8px 16px', fontSize: '14px', background: 'none', border: '1px solid var(--border)', color: 'var(--text-main)' }}
          >
            <MailOpen size={16} /> Mark all read
          </button>
        )}
      </div>

      {error && <div style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {notifications.length > 0 ? (
            notifications.map((notif, idx) => (
              <motion.div
                key={notif._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card"
                style={{ 
                  padding: '20px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '16px',
                  background: notif.read ? 'white' : 'rgba(99, 102, 241, 0.03)',
                  border: notif.read ? '1px solid var(--border)' : '1px solid rgba(99, 102, 241, 0.1)'
                }}
              >
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    background: notif.read ? 'rgba(0,0,0,0.03)' : 'rgba(99, 102, 241, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div>
                    <p style={{ fontSize: '15px', color: 'var(--text-main)', marginBottom: '4px', fontWeight: notif.read ? '400' : '600' }}>{notif.message}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <Clock size={12} /> {new Date(notif.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                  <div style={{ alignSelf: 'flex-end', display: 'flex', gap: '8px' }}>
                    {!notif.read && (
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        onClick={() => markAsRead(notif._id)}
                        style={{ 
                          background: 'rgba(99, 102, 241, 0.05)', 
                          color: 'var(--primary)', 
                          cursor: 'pointer', 
                          padding: '10px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                      >
                        <Mail size={16} /> Mark as read
                      </motion.button>
                    )}
                  </div>
              </motion.div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '100px 40px', opacity: 0.5 }}>
              <Bell size={48} style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>All Caught Up!</h3>
              <p>When you have activity on your drives, they'll appear here.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Notifications;