import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
  Users, 
  Heart, 
  IndianRupee, 
  TrendingUp, 
  Calendar,
  Filter,
  FileSpreadsheet,
  Activity,
  ArrowUpRight,
  ArrowDownRight
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

const Reports = () => {
  const [data, setData] = useState({
    summary: { totalRevenue: 0, totalDonations: 0, totalUsers: 0, avgDonation: 0 },
    trends: {
      revenue: { val: '0%', up: true },
      donations: { val: '0%', up: true },
      users: { val: '0%', up: true },
      avg: { val: '0%', up: true }
    },
    donations: [],
    drives: [],
    chartData: [],
    roleDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const res = await api.get('/reports/stats');
      const stats = res.data.data;
      
      // Filter out admin from demographics on the frontend as a fallback
      if (stats.roleDistribution) {
        stats.roleDistribution = stats.roleDistribution.filter(r => r.name.toLowerCase() !== 'admin');
      }
      
      setData(stats);
    } catch (err) {
      console.error('Report Error:', err);
      setError('Failed to aggregate platform reports. Ensure database connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Donor', 'Type', 'Amount (INR)', 'Drive'];
    const rows = data.donations.map(d => [
      new Date(d.date).toLocaleDateString(),
      d.donor?.name || 'Anonymous',
      d.type,
      d.amount || '-',
      d.drive?.title || 'General'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `platform_report_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="fade-in" style={{ color: 'var(--primary)', fontWeight: '600' }}>Aggregating Platform Intelligence...</div>
    </div>
  );

  return (
    <motion.div 
      className="page-transition-wrapper container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '80px' }}
    >
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '10px' }}>Platform Intelligence</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Optimized aggregation of donation flows and user engagement.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={exportToCSV}
            className="btn-primary" 
            style={{ padding: '12px 24px', background: 'white', color: 'var(--text-main)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FileSpreadsheet size={18} /> Export CSV
          </button>
          <button className="btn-primary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} /> Last 30 Days
          </button>
        </div>
      </div>

      {error && <div style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>{error}</div>}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <MetricCard 
          icon={<IndianRupee size={24} />} 
          label="Total Revenue" 
          value={`₹${data.summary.totalRevenue.toLocaleString()}`} 
          trend={data.trends.revenue.val} 
          isUp={data.trends.revenue.up} 
        />
        <MetricCard 
          icon={<Heart size={24} />} 
          label="Total Donations" 
          value={data.summary.totalDonations} 
          trend={data.trends.donations.val} 
          isUp={data.trends.donations.up} 
        />
        <MetricCard 
          icon={<Users size={24} />} 
          label="User Base" 
          value={data.summary.totalUsers} 
          trend={data.trends.users.val} 
          isUp={data.trends.users.up} 
        />
        <MetricCard 
          icon={<TrendingUp size={24} />} 
          label="Avg. Donation" 
          value={`₹${data.summary.avgDonation}`} 
          trend={data.trends.avg.val} 
          isUp={data.trends.avg.up} 
        />
      </div>

      {/* Main Charts Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700' }}>7-Day Revenue Trajectory</h3>
            <Activity size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer>
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="reportGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#reportGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '32px' }}>User Distribution</h3>
          <div style={{ height: '250px', width: '100%' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.roleDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
            {data.roleDistribution.map((entry, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[index % COLORS.length] }} />
                  {entry.name}
                </span>
                <span style={{ fontWeight: '700' }}>{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table Preview */}
      <div className="glass-card" style={{ padding: '32px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Platform Overview</h3>
          <Filter size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 8px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px' }}>CAMPAIGN</th>
              <th style={{ padding: '16px 8px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px' }}>CREATOR</th>
              <th style={{ padding: '16px 8px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px' }}>GOAL</th>
              <th style={{ padding: '16px 8px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px' }}>STATUS</th>
              <th style={{ padding: '16px 8px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px' }}>DATE</th>
            </tr>
          </thead>
          <tbody>
            {data.drives?.slice(0, 5).map((drive, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                <td style={{ padding: '20px 8px', fontWeight: '600', fontSize: '14px' }}>{drive.title}</td>
                <td style={{ padding: '20px 8px', fontSize: '14px' }}>{drive.creator?.name || 'Admin'}</td>
                <td style={{ padding: '20px 8px', fontSize: '14px', fontWeight: '500' }}>₹{drive.monetaryGoal?.toLocaleString()}</td>
                <td style={{ padding: '20px 8px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '11px', 
                    fontWeight: '700',
                    background: drive.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: drive.status === 'approved' ? 'var(--success)' : 'var(--warning)'
                  }}>
                    {drive.status?.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '20px 8px', fontSize: '14px', color: 'var(--text-muted)' }}>{drive.createdAt ? new Date(drive.createdAt).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const MetricCard = ({ icon, label, value, trend, isUp }) => (
  <div className="glass-card" style={{ padding: '24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <div style={{ color: 'var(--primary)', opacity: 0.8 }}>{icon}</div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px', 
        fontSize: '12px', 
        fontWeight: '700',
        color: isUp ? 'var(--success)' : 'var(--error)'
      }}>
        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {trend}
      </div>
    </div>
    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)' }}>{value}</div>
  </div>
);

export default Reports;
