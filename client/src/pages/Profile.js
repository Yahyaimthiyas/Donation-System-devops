import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Shield, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Camera,
  Phone,
  CreditCard,
  MapPin,
  FileText,
  BadgeCheck
} from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phoneNumber: '', 
    aadhaarNumber: '', 
    profileImage: '', 
    bio: '',
    location: { city: '', state: '', pincode: '', fullAddress: '' }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ 
        name: user.name || '', 
        email: user.email || '', 
        phoneNumber: user.phoneNumber || '', 
        aadhaarNumber: user.aadhaarNumber || '', 
        profileImage: user.profileImage || '', 
        bio: user.bio || '',
        location: user.location || { city: '', state: '', pincode: '', fullAddress: '' }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('loc_')) {
      const field = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError('');
    setSuccess('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await api.put('/users', formData);
      const res = await api.get('/auth/me');
      setUser(res.data.data);
      setSuccess('Your verified profile has been updated!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    outline: 'none',
    fontSize: '15px',
    transition: 'all 0.2s',
    background: 'white'
  };

  const labelStyle = { 
    display: 'block', 
    fontSize: '13px', 
    fontWeight: '700', 
    marginBottom: '8px', 
    color: 'var(--text-main)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <motion.div 
      className="page-transition-wrapper container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '100px' }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>Verified Profile Identity</h1>
          <p style={{ color: 'var(--text-muted)' }}>Complete your professional profile to increase trust and impact.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '32px' }}>
          
          {/* Header Section: Avatar & Verification */}
          <div className="glass-card" style={{ padding: '40px', display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '30px', overflow: 'hidden', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)' }}>
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: 'white', fontSize: '40px', fontWeight: '800' }}>{formData.name[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <label style={{ position: 'absolute', bottom: '-8px', right: '-8px', background: 'white', color: 'var(--primary)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>
                <Camera size={20} />
                <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
              </label>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>{formData.name || 'New User'}</h2>
                {user?.isVerified && <BadgeCheck style={{ color: '#0ea5e9' }} size={24} />}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>{user?.role}</span>
                <span style={{ background: user?.isVerified ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)', color: user?.isVerified ? 'var(--success)' : 'var(--text-muted)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
                   {user?.isVerified ? 'Verified Profile' : 'Pending Verification'}
                </span>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {(error || success) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                style={{ padding: '16px', borderRadius: '12px', background: error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: error ? 'var(--error)' : 'var(--success)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600' }}
              >
                {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />} {error || success}
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
             {/* Account Details */}
             <div className="glass-card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={20} className="text-primary" /> Core Information
                </h3>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                   <div>
                     <label style={labelStyle}>Full Legal Name</label>
                     <div style={{ position: 'relative' }}>
                       <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                       <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                     </div>
                   </div>

                   <div>
                     <label style={labelStyle}>Email Address</label>
                     <div style={{ position: 'relative' }}>
                       <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                       <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
                     </div>
                   </div>

                   <div>
                     <label style={labelStyle}>Contact Number</label>
                     <div style={{ position: 'relative' }}>
                       <Phone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                       <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+91 XXXX XXXX" style={inputStyle} />
                     </div>
                   </div>

                   <div>
                     <label style={labelStyle}>Aadhaar Number (Last 4 digits for display)</label>
                     <div style={{ position: 'relative' }}>
                       <CreditCard style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                       <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="XXXX XXXX XXXX" style={inputStyle} />
                     </div>
                   </div>
                </div>
             </div>

             {/* Personal Branding & Bio */}
             <div className="glass-card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={20} className="text-primary" /> Personal Bio
                </h3>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                   <div>
                     <label style={labelStyle}>Your Impact Story</label>
                     <textarea 
                        name="bio" 
                        value={formData.bio} 
                        onChange={handleChange} 
                        rows="8" 
                        placeholder="Tell donors more about yourself or your organization..."
                        style={{ ...inputStyle, paddingLeft: '16px', resize: 'none' }}
                     />
                   </div>
                </div>
             </div>
          </div>

          {/* Location Details */}
          <div className="glass-card" style={{ padding: '32px' }}>
             <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <MapPin size={20} className="text-primary" /> Verified Address
             </h3>
             <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input type="text" name="loc_fullAddress" value={formData.location?.fullAddress} onChange={handleChange} placeholder="Full Address" style={{ ...inputStyle, paddingLeft: '16px' }} />
                <input type="text" name="loc_city" value={formData.location?.city} onChange={handleChange} placeholder="City" style={{ ...inputStyle, paddingLeft: '16px' }} />
                <input type="text" name="loc_state" value={formData.location?.state} onChange={handleChange} placeholder="State" style={{ ...inputStyle, paddingLeft: '16px' }} />
                <input type="text" name="loc_pincode" value={formData.location?.pincode} onChange={handleChange} placeholder="Pincode" style={{ ...inputStyle, paddingLeft: '16px' }} />
             </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }} 
            whileTap={{ scale: 0.99 }} 
            type="submit" 
            disabled={loading} 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '18px', fontSize: '18px' }}
          >
            {loading ? 'Updating Identity...' : <><Save size={20} /> Finalize Profile Changes</>}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default Profile;