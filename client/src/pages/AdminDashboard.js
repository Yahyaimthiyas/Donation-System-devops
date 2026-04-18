import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  MapPin, 
  User, 
  CheckCircle, 
  XCircle, 
  IndianRupee,
  Eye,
  FileText,
  Phone,
  Calendar,
  ExternalLink,
  AlertTriangle,
  LayoutDashboard
} from 'lucide-react';

const AdminDashboard = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending');
  const [selectedDrive, setSelectedDrive] = useState(null);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/drives/my-drives'); // Admin endpoint for all drives
      const data = res.data.data || res.data;
      setDrives(data.filter(d => d && d._id));
    } catch (err) {
      setError('Failed to fetch platform drives. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (driveId, status, comment = '') => {
    try {
      await api.put(`/drives/${driveId}/status`, { status, comment });
      setDrives(drives.map(d => d._id === driveId ? { ...d, status, adminComment: comment } : d));
      setSelectedDrive(null);
    } catch (err) {
      setError('Failed to update campaign status.');
    }
  };

  const filteredDrives = drives.filter(d => filter === 'all' ? true : d.status === filter);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="fade-in" style={{ color: 'var(--primary)', fontWeight: '600' }}>Accessing Admin Portal...</div>
    </div>
  );

  return (
    <motion.div 
      className="page-transition-wrapper container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '80px' }}
    >
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
            <ShieldCheck size={18} /> Administrative Access
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Review & Approval Portal</h1>
        </div>
        
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', padding: '4px', borderRadius: '10px' }}>
          {['pending', 'approved', 'all'].map(btn => (
            <button key={btn} onClick={() => setFilter(btn)} style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', background: filter === btn ? 'white' : 'transparent', boxShadow: filter === btn ? 'var(--shadow-sm)' : 'none', color: filter === btn ? 'var(--primary)' : 'var(--text-muted)' }}>
              {btn.charAt(0).toUpperCase() + btn.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && <div style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>{error}</div>}

      <div style={{ display: 'grid', gap: '20px' }}>
        <AnimatePresence>
          {filteredDrives.length > 0 ? (
            filteredDrives.map((drive) => (
              <motion.div
                key={drive._id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="glass-card"
                style={{ display: 'grid', gridTemplateColumns: '120px 1fr 200px', gap: '24px', padding: '24px', alignItems: 'center' }}
              >
                <div style={{ height: '100px', borderRadius: '12px', overflow: 'hidden' }}>
                  <img src={drive.coverImage || drive.images?.[0] || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&auto=format&fit=crop'} alt={drive.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', textTransform: 'uppercase' }}>{drive.category}</span>
                    {drive.urgency === 'Critical' && <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', textTransform: 'uppercase' }}>CRITICAL</span>}
                    <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{drive.title}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> {drive.beneficiaryName || drive.creator?.name}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {drive.city || drive.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IndianRupee size={14} /> ₹{drive.monetaryGoal?.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                   <button onClick={() => setSelectedDrive(drive)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'white', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                     <Eye size={18} /> View Verification
                   </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '100px 40px', opacity: 0.5 }}>
               <ShieldCheck size={48} style={{ margin: '0 auto 20px' }} />
               <p>The review queue is currently empty for the '{filter}' status.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Verification Modal */}
      <AnimatePresence>
        {selectedDrive && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="glass-card" 
              style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '40px', position: 'relative' }}
            >
              <button 
                onClick={() => setSelectedDrive(null)} 
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <XCircle size={32} />
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                {/* Information Column */}
                <div>
                  <div style={{ marginBottom: '32px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase' }}>Campaign Verification Details</span>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>{selectedDrive.title}</h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <InfoRow icon={<LayoutDashboard size={18} />} label="Category & Urgency" value={`${selectedDrive.category} (${selectedDrive.urgency || 'Normal'})`} />
                    <InfoRow icon={<IndianRupee size={18} />} label="Target Amount" value={`₹${selectedDrive.monetaryGoal?.toLocaleString()}`} />
                    <InfoRow icon={<User size={18} />} label="Beneficiary" value={selectedDrive.beneficiaryName} />
                    <InfoRow icon={<Phone size={18} />} label="Contact" value={selectedDrive.contactNumber} />
                    <InfoRow icon={<MapPin size={18} />} label="Location" value={`${selectedDrive.location}, ${selectedDrive.city}, ${selectedDrive.state} - ${selectedDrive.pincode}`} />
                    <InfoRow icon={<Calendar size={18} />} label="Timeline" value={`${new Date(selectedDrive.startDate).toLocaleDateString()} to ${new Date(selectedDrive.endDate).toLocaleDateString()}`} />
                    
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' }}>Campaign Story Overview</div>
                      <div style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)', background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', maxHeight: '150px', overflowY: 'auto' }}>
                        {selectedDrive.description || 'No description provided.'}
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', padding: '20px', borderRadius: '12px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border)' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} /> Identity & Legal Documents</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedDrive.documentLinks?.length > 0 ? selectedDrive.documentLinks.map((doc, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => {
                              // Bypass browser data URI restrictions by forcing a download
                              const link = document.createElement('a');
                              link.href = doc.url;
                              link.download = doc.name || `verification_document_${idx+1}`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '20px', height: '20px', background: 'var(--primary)', borderRadius: '4px' }} /> 
                              {doc.name || `Document ${idx + 1}`}
                            </span>
                            <ExternalLink size={14} style={{ color: 'var(--primary)' }} />
                          </button>
                        )) : <div style={{ fontSize: '12px', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={14} /> No verification documents uploaded.</div>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media & Action Column */}
                <div>
                  <div style={{ height: '240px', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', border: '1px solid var(--border)', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedDrive.coverImage || selectedDrive.images?.[0] ? (
                       <img src={selectedDrive.coverImage || selectedDrive.images[0]} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                       <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No Cover Image</span>
                    )}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '32px' }}>
                    {selectedDrive.images?.map((img, i) => (
                      <div key={i} style={{ height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <img src={img} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>

                  <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Take Administrative Action</h4>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        onClick={() => handleStatusChange(selectedDrive._id, 'approved')}
                        disabled={selectedDrive.status === 'approved'}
                        className="btn-primary" 
                        style={{ flex: 1, justifyContent: 'center', background: 'var(--success)' }}
                      >
                        <CheckCircle size={18} /> Approve
                      </button>
                      <button 
                         onClick={() => {
                           const msg = prompt('Reason for declining (will be sent to beneficiary):');
                           if (msg) handleStatusChange(selectedDrive._id, 'declined', msg);
                         }}
                        className="btn-primary" 
                        style={{ flex: 1, justifyContent: 'center', background: 'var(--error)' }}
                      >
                        <XCircle size={18} /> Decline
                      </button>
                    </div>
                    <p style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>Approving this drive will make it publicly visible to all donors.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.05)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{label}</div>
      <div style={{ fontSize: '15px', fontWeight: '700' }}>{value || 'Not Provided'}</div>
    </div>
  </div>
);

export default AdminDashboard;