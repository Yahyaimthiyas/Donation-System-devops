import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

const DriveCard = ({ drive }) => {
  const navigate = useNavigate();
  const progress = drive.monetaryGoal ? Math.min(((drive.raisedAmount || 0) / drive.monetaryGoal) * 100, 100) : 0;

  return (
    <motion.div 
      className="glass-card"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/drives/${drive._id}`)}
      style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
    >
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img 
          src={drive.coverImage || drive.images?.[0] || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop'} 
          alt={drive.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        
        {/* Badges Overlay */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ 
            padding: '4px 12px', 
            borderRadius: '20px', 
            background: 'rgba(255,255,255,0.95)', 
            fontSize: '11px', 
            fontWeight: '800',
            color: 'var(--primary)',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
             {drive.category}
          </div>
          {drive.urgency === 'Critical' && (
            <div style={{ 
              padding: '4px 12px', 
              borderRadius: '20px', 
              background: '#ef4444', 
              fontSize: '11px', 
              fontWeight: '800',
              color: 'white',
              textTransform: 'uppercase',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
               Critical
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: '700', fontSize: '12px' }}>
            <ShieldCheck size={14} /> Verified Cause
          </div>
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)', lineHeight: 1.4, height: '50px', overflow: 'hidden' }}>
          {drive.title}
        </h3>

        <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {drive.city || drive.location}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><TrendingUp size={14} /> {drive.donations?.length || 0} Backers</span>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', fontWeight: '700' }}>
             <span style={{ color: 'var(--text-main)' }}>₹{(drive.raisedAmount || 0).toLocaleString()} <span style={{ fontWeight: '400', color: 'var(--text-muted)' }}>raised</span></span>
             <span style={{ color: 'var(--primary)' }}>{Math.round(progress)}%</span>
          </div>
          
          <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), #818cf8)', borderRadius: '4px' }} 
             />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
             <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
               <span style={{ display: 'block', fontWeight: '800', color: 'var(--text-main)', fontSize: '14px' }}>₹{drive.monetaryGoal?.toLocaleString()}</span>
               Goal Amount
             </div>
             <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>
               <span style={{ display: 'block', fontWeight: '800', color: 'var(--text-main)', fontSize: '14px' }}>{Math.ceil((new Date(drive.endDate) - new Date()) / (1000 * 60 * 60 * 24))}</span>
               Days Left
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DriveCard;