import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/drives/my-drives');
      const data = res.data.data || res.data;
      setDrives(data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load your campaigns');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
            <CheckCircle2 size={12} /> Approved
          </div>
        );
      case 'declined':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
            <XCircle size={12} /> Declined
          </div>
        );
      default:
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
            <Clock size={12} /> Pending
          </div>
        );
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="fade-in" style={{ color: 'var(--primary)', fontWeight: '600' }}>Loading your dashboard...</div>
    </div>
  );

  return (
    <motion.div 
      className="page-transition-wrapper container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '60px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Campaign Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track and manage the progress of your transparency drives.</p>
        </div>
        <Link to="/create-drive" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Create New Drive
        </Link>
      </div>

      {error && <div style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>{error}</div>}

      {drives.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
          <AnimatePresence>
            {drives.map((drive, idx) => {
              const progress = drive.monetaryGoal ? Math.min(((drive.raisedAmount || 0) / drive.monetaryGoal) * 100, 100) : 0;
              return (
                <motion.div
                  key={drive._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card"
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ position: 'relative', height: '180px' }}>
                    <img 
                      src={drive.coverImage || drive.images?.[0] || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop'} 
                      alt={drive.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      {getStatusBadge(drive.status)}
                    </div>
                  </div>

                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>{drive.title}</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <MapPin size={16} /> {drive.location}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <Users size={16} /> {drive.backers || 0} Backers
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{(drive.raisedAmount || 0).toLocaleString()} <span style={{ fontWeight: '400', color: 'var(--text-muted)' }}>raised</span></span>
                        <span style={{ color: 'var(--text-muted)' }}>{Math.round(progress)}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px' }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', borderRadius: '3px' }} />
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to={`/edit-drive/${drive._id}`} style={{ 
                          padding: '10px 16px', 
                          borderRadius: '8px', 
                          border: '1px solid var(--primary)', 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: 'var(--primary)',
                          background: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          Edit Campaign
                        </Link>
                        <Link to={`/drive/${drive._id}`} style={{ 
                          flex: 1, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '6px',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--text-main)',
                          background: 'white'
                        }}>
                          <ExternalLink size={16} /> View
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '100px 40px' }}>
          <LayoutDashboard size={48} style={{ margin: '0 auto 20px', opacity: 0.2 }} />
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>No campaigns found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>You haven't launched any drives yet. Start your first mission to make an impact.</p>
          <Link to="/create-drive" className="btn-primary" style={{ margin: '0 auto' }}>Launch First Drive</Link>
        </div>
      )}
    </motion.div>
  );
};

export default MyDrives;