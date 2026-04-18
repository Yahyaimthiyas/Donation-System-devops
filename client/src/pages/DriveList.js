import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DriveCard from '../components/DriveCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Sparkles, Megaphone } from 'lucide-react';

const DriveList = () => {
  const [drives, setDrives] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/drives');
      const data = res.data.data || res.data;
      setDrives(data);
    } catch (err) {
      setError('Failed to load active drives. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedDrive) => {
    setDrives((prev) => prev.map((d) => (d._id === updatedDrive._id ? { ...d, ...updatedDrive } : d)));
  };

  const filteredDrives = drives.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="fade-in" style={{ color: 'var(--primary)', fontWeight: '600' }}>Discovering Impacts...</div>
    </div>
  );

  return (
    <motion.div 
      className="page-transition-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '80px' }}
    >
      {/* Page Header */}
      <section style={{ 
        padding: '60px 0', 
        background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
        marginBottom: '40px'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ display: 'inline-flex', padding: '10px', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-md)', color: 'var(--primary)', marginBottom: '20px' }}
            >
              <Megaphone size={28} />
            </motion.div>
            <h1 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '16px' }}>Explore Active Drives</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Your contribution, no matter how small, can change a life today. Browse through verified campaigns and find a cause that speaks to you.</p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Search and Filters Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '40px',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search by cause, title or description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 12px 12px 40px', 
                borderRadius: '10px', 
                border: '1px solid var(--border)', 
                outline: 'none',
                fontSize: '15px'
              }} 
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', background: 'white', border: '1px solid var(--border)', fontSize: '14px', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <Filter size={16} /> All Categories
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', background: 'white', border: '1px solid var(--border)', fontSize: '14px', color: 'var(--text-muted)', cursor: 'pointer' }}>
               <Sparkles size={16} className="text-primary" /> Trending
            </div>
          </div>
        </div>

        {error && <div style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>{error}</div>}

        {/* Drives Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
          gap: '32px' 
        }}>
          <AnimatePresence>
            {filteredDrives.length > 0 ? (
              filteredDrives.map((drive) => (
                <motion.div
                  key={drive._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <DriveCard drive={drive} onUpdate={handleUpdate} />
                </motion.div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                 <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                 <p>No drives found matching your criteria. Try a different search term.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default DriveList;