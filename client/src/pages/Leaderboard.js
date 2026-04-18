import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, User, TrendingUp, IndianRupee } from 'lucide-react';

const Leaderboard = () => {
  const [topDonors, setTopDonors] = useState([]);
  const [topBeneficiaries, setTopBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard');
        if (res.data && res.data.topDonors) setTopDonors(res.data.topDonors);
        if (res.data && res.data.topBeneficiaries) setTopBeneficiaries(res.data.topBeneficiaries);
      } catch (err) {
        setError('Unable to fetch the Hall of Fame. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy size={20} style={{ color: '#fbbf24' }} />;
    if (index === 1) return <Medal size={20} style={{ color: '#94a3b8' }} />;
    if (index === 2) return <Award size={20} style={{ color: '#b45309' }} />;
    return <span style={{ fontSize: '14px', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{index + 1}</span>;
  };

  const InitialsAvatar = ({ name }) => (
    <div style={{ 
      width: '40px', 
      height: '40px', 
      borderRadius: '50%', 
      background: 'rgba(99, 102, 241, 0.1)', 
      color: 'var(--primary)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '700'
    }}>
      {name.split(' ').map(n => n[0]).join('').toUpperCase()}
    </div>
  );

  const LeaderboardCard = ({ title, data, valueKey, label }) => (
    <div className="glass-card" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '10px' }}>
          <Trophy className="text-primary" size={24} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{title}</h2>
      </div>

      {data.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.map((item, index) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px',
                borderRadius: '12px',
                background: index < 3 ? 'rgba(99, 102, 241, 0.03)' : 'transparent',
                border: index < 3 ? '1px solid rgba(99, 102, 241, 0.05)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {getRankIcon(index)}
                <InitialsAvatar name={item.name} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--primary)' }}>
                   ₹{item[valueKey].toLocaleString()}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
                  <TrendingUp size={10} /> IMPACT
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>
          <User size={40} style={{ margin: '0 auto 12px' }} />
          <p>No champions yet!</p>
        </div>
      )}
    </div>
  );

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="fade-in" style={{ color: 'var(--primary)', fontWeight: '600' }}>Entering Hall of Fame...</div>
    </div>
  );

  return (
    <motion.div 
      className="page-transition-wrapper container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '60px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          style={{ 
            display: 'inline-flex', 
            padding: '12px', 
            background: 'rgba(251, 191, 36, 0.1)', 
            borderRadius: '50%', 
            color: '#fbbf24',
            marginBottom: '20px'
          }}
        >
          <Trophy size={48} fill="currentColor" />
        </motion.div>
        <h1 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '12px' }}>Hall of Fame</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          Celebrating the incredible generosity of our donors and the relentless dedication of our beneficiaries.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', 
        gap: '40px' 
      }}>
        <LeaderboardCard 
          title="Top Donors" 
          data={topDonors} 
          valueKey="totalDonated" 
          label="Total Contributions"
        />
        <LeaderboardCard 
          title="Top Beneficiaries" 
          data={topBeneficiaries} 
          valueKey="totalRaised" 
          label="Total Impacts Created"
        />
      </div>
    </motion.div>
  );
};

export default Leaderboard;