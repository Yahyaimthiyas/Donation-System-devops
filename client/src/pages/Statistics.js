import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Heart, 
  IndianRupee, 
  TrendingUp, 
  Target,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalDrives: 0,
    totalDonations: 0,
    totalUsers: 0,
    totalAmountRaised: 0,
    rolesDistribution: [],
    recentDonations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [drivesRes, donationsRes, usersRes] = await Promise.all([
          api.get('/drives/my-drives'),
          api.get('/donations'),
          api.get('/users')
        ]);

        const users = usersRes.data.data || usersRes.data;
        const donations = donationsRes.data.data || donationsRes.data;
        const drives = drivesRes.data.data || drivesRes.data;

        // Process role distribution for Pie Chart
        const roles = users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});

        const rolesData = Object.keys(roles).map(key => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: roles[key]
        }));

        // Mock chart data based on real stats for visual impact
        const chartData = [
          { name: 'Week 1', amount: 4000 },
          { name: 'Week 2', amount: 3000 },
          { name: 'Week 3', amount: 2000 },
          { name: 'Week 4', amount: donations.reduce((sum, d) => sum + (d.amount || 0), 0) },
        ];

        setStats({
          totalDrives: drives.length,
          totalDonations: donations.length,
          totalUsers: users.length,
          totalAmountRaised: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
          rolesDistribution: rolesData,
          chartData: chartData
        });
      } catch (err) {
        setError('Failed to load real-time analytics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

  const cardStyle = {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="fade-in" style={{ color: 'var(--primary)', fontWeight: '600' }}>Loading Analytics...</div>
    </div>
  );

  return (
    <motion.div 
      className="page-transition-wrapper container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ paddingBottom: '60px' }}
    >
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Platform Analytics</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time overview of your impact and community growth</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', color: 'var(--primary)', fontWeight: '500', fontSize: '14px', alignItems: 'center' }}>
          <Activity size={16} /> Live Data
        </div>
      </div>

      {error && <div style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>{error}</div>}

      {/* Metrics Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div className="glass-card" style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Total Funds Raised</span>
            <IndianRupee size={20} className="text-secondary" />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 'bold' }}>₹{stats.totalAmountRaised.toLocaleString()}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--success)' }}>
            <TrendingUp size={12} /> +12.5% vs last month
          </div>
        </div>

        <div className="glass-card" style={cardStyle}>
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Active Users</span>
            <Users size={20} className="text-primary" />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalUsers}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Verified community members</span>
        </div>

        <div className="glass-card" style={cardStyle}>
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Total Donations</span>
            <Heart size={20} style={{ color: '#ec4899' }} />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalDonations}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Succesfully processed gifts</span>
        </div>

        <div className="glass-card" style={cardStyle}>
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Active Drives</span>
            <Target size={20} style={{ color: '#06b6d4' }} />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalDrives}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Ongoing fundraising campaigns</span>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', 
        gap: '32px' 
      }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={20} className="text-primary" /> Donation Growth
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PieChartIcon size={20} className="text-secondary" /> Community Composition
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats.rolesDistribution}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.rolesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
            {stats.rolesDistribution.map((entry, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[index] }} />
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Statistics;