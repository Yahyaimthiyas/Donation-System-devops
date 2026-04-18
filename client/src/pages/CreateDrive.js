import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  Image as ImageIcon, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  ClipboardList, 
  X, 
  Send,
  AlertCircle,
  FileText,
  User as UserIcon,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Video,
  ArrowRight,
  ArrowLeft,
  Building2,
  Stethoscope,
  School,
  Heart
} from 'lucide-react';

const CreateDrive = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Individual Problem',
    description: '',
    beneficiaryName: '',
    beneficiaryUPI: '',
    coverImage: '',
    images: [],
    videoUrl: '',
    contactNumber: '',
    alternateNumber: '',
    documentLinks: [],
    monetaryGoal: '',
    isTaxBenefitAvailable: false,
    urgency: 'Normal',
    itemsNeeded: [],
    location: '',
    city: '',
    state: '',
    pincode: '',
    locationCoordinates: { lat: 0, lng: 0 },
    startDate: '',
    endDate: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    { id: 'Medical', label: 'Medical Emergency', icon: <Stethoscope size={18} /> },
    { id: 'Education', label: 'Education Support', icon: <School size={18} /> },
    { id: 'NGO', label: 'NGO Initiative', icon: <Building2 size={18} /> },
    { id: 'Old Age Home', label: 'Elderly Care', icon: <Heart size={18} /> },
    { id: 'Children\'s Home', label: 'Children\'s Home', icon: <PlusCircle size={18} /> },
    { id: 'Individual Problem', label: 'Personal Crisis', icon: <UserIcon size={18} /> },
    { id: 'Disaster Relief', label: 'Disaster Relief', icon: <ShieldCheck size={18} /> }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFileUpload = (e, field) => {
    const files = Array.from(e.target.files);
    const promises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ name: file.name, url: reader.result, docType: 'official' });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(results => {
      if (field === 'images') {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...results.map(r => r.url)] }));
      } else if (field === 'coverImage') {
        setFormData(prev => ({ ...prev, coverImage: results[0].url }));
      } else if (field === 'documentLinks') {
        setFormData(prev => ({ ...prev, documentLinks: [...prev.documentLinks, ...results] }));
      }
    });
  };

  const removeFile = (idx, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 4) return setStep(step + 1);
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/drives', formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to launch campaign. Ensure all mandatory verification fields are filled.');
      // Drop back to step with error if needed
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    outline: 'none',
    fontSize: '15px',
    transition: 'all 0.2s',
    background: 'white'
  };

  const labelStyle = { 
    display: 'block', 
    fontSize: '14px', 
    fontWeight: '700', 
    marginBottom: '10px', 
    color: 'var(--text-main)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  if (success) {
    return (
      <div className="page-transition-wrapper container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card"
          style={{ textAlign: 'center', padding: '60px', maxWidth: '600px' }}
        >
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>Campaign Initialized!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '18px' }}>Your drive is now in the **Verification Queue**. Our team will audit your Aadhaar and documents to ensure 100% platform integrity. This usually takes 2-4 hours.</p>
          <button className="btn-primary" onClick={() => navigate('/my-drives')}>View Status & Dashboard</button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="page-transition-wrapper container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '100px' }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ background: 'var(--primary)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '16px', display: 'inline-block' }}>Professional Campaign Wizard</span>
          <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.02em' }}>Launch a Trustworthy Drive</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Complete the 4-step verification to ensure your cause is authentic and impactful.</p>
        </div>

        {/* Progress Tracker */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ 
              width: '100px', 
              height: '4px', 
              borderRadius: '2px', 
              background: step >= s ? 'var(--primary)' : 'var(--border)',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          {/* Step Header */}
          <div style={{ padding: '24px 40px', background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h2 style={{ fontSize: '18px', fontWeight: '700' }}>
               {step === 1 && "Identity & Category Verification"}
               {step === 2 && "Campaign Mission & Financials"}
               {step === 3 && "Legal Documents & Location"}
               {step === 4 && "Multimedia Gallery & Review"}
             </h2>
             <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>Step {step} of 4</span>
          </div>

          <div style={{ padding: '40px' }}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                >
                  <div>
                    <label style={labelStyle}>Campaign Category</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                      {categories.map(cat => (
                        <div 
                          key={cat.id}
                          onClick={() => setFormData({...formData, category: cat.id})}
                          style={{ 
                            padding: '16px', 
                            borderRadius: '12px', 
                            border: `2px solid ${formData.category === cat.id ? 'var(--primary)' : 'var(--border)'}`,
                            background: formData.category === cat.id ? 'rgba(99, 102, 241, 0.05)' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ color: formData.category === cat.id ? 'var(--primary)' : 'var(--text-muted)' }}>{cat.icon}</div>
                          <span style={{ fontSize: '14px', fontWeight: '700' }}>{cat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-grid">
                    <div>
                      <label style={labelStyle}>Beneficiary Full Name</label>
                      <div style={{ position: 'relative' }}>
                        <UserIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input type="text" name="beneficiaryName" value={formData.beneficiaryName} onChange={handleChange} placeholder="As per Aadhaar/PAN" required style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Primary Contact Number</label>
                      <div style={{ position: 'relative' }}>
                        <Phone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="+91 98XXX XXXXX" required style={inputStyle} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Beneficiary UPI ID (Optional / For Settlements)</label>
                    <div style={{ position: 'relative' }}>
                      <IndianRupee style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                      <input type="text" name="beneficiaryUPI" value={formData.beneficiaryUPI} onChange={handleChange} placeholder="e.g. 9876543210@ybl or johndoe@sbi" style={{...inputStyle, background: 'rgba(99, 102, 241, 0.05)', borderColor: 'var(--border)'}} />
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>Funds will be processed securely via Razorpay and dispatched to this account during settlement.</p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                >
                  <div>
                    <label style={labelStyle}>Campaign Title</label>
                    <div style={{ position: 'relative' }}>
                      <ClipboardList style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                      <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Immediate Medical Support for Raj's Heart Surgery" required style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>The Full Story</label>
                    <div style={{ position: 'relative' }}>
                      <FileText style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} size={18} />
                      <textarea name="description" value={formData.description} onChange={handleChange} rows="6" placeholder="Be detailed. Donors trust stories with specific facts, dates, and clear needs." required style={{ ...inputStyle, paddingLeft: '40px', resize: 'vertical' }} />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div>
                      <label style={labelStyle}>Goal Amount (₹)</label>
                      <div style={{ position: 'relative' }}>
                        <IndianRupee style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input type="number" name="monetaryGoal" value={formData.monetaryGoal} onChange={handleChange} placeholder="1,00,000" required style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Complexity/Urgency</label>
                      <select name="urgency" value={formData.urgency} onChange={handleChange} style={{ ...inputStyle, paddingLeft: '16px' }}>
                        <option value="Normal">Normal</option>
                        <option value="High">High Priority</option>
                        <option value="Critical">Immediate/Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid" style={{ gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Launch Date</label>
                      <div style={{ position: 'relative' }}>
                        <Calendar style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Completion Date</label>
                      <div style={{ position: 'relative' }}>
                        <Calendar style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required style={inputStyle} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                >
                  <div>
                    <label style={labelStyle}>Verification Documents (Aadhaar/Reports)</label>
                    <label style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      padding: '40px', 
                      border: '2px dashed var(--border)', 
                      borderRadius: '16px', 
                      cursor: 'pointer',
                      background: 'rgba(0,0,0,0.01)',
                      transition: 'all 0.2s'
                    }} onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.01)'}>
                      <ShieldCheck size={32} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
                      <span style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>Upload Verification Proofs</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>PDF, JPG, or PNG (Max 5MB)</span>
                      <input type="file" multiple onChange={(e) => handleFileUpload(e, 'documentLinks')} style={{ display: 'none' }} />
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                      {formData.documentLinks.map((doc, idx) => (
                        <div key={idx} style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700' }}>
                          <FileText size={14} /> {doc.name}
                          <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeFile(idx, 'documentLinks')} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Precise Display Location</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        <MapPin style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Full Address" style={inputStyle} />
                      </div>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" style={{ ...inputStyle, paddingLeft: '16px' }} />
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" style={{ ...inputStyle, paddingLeft: '16px' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                >
                  <div className="form-grid">
                    <div>
                      <label style={labelStyle}>Primary Cover Image</label>
                      <label style={{ 
                        height: '200px',
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        border: '2px dashed var(--border)', 
                        borderRadius: '16px', 
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        {formData.coverImage ? (
                          <img src={formData.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <>
                            <ImageIcon size={32} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Upload Cover Photo</span>
                          </>
                        )}
                        <input type="file" onChange={(e) => handleFileUpload(e, 'coverImage')} style={{ display: 'none' }} />
                      </label>
                    </div>
                    <div>
                      <label style={labelStyle}>Video Pitch (Url)</label>
                      <div style={{ position: 'relative', marginBottom: '24px' }}>
                        <Video style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="YouTube/Vimeo Link" style={inputStyle} />
                      </div>
                      <label style={labelStyle}>Enable Tax Benefits (80G)?</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', borderRadius: '12px', background: 'rgba(0,0,0,0.02)' }}>
                        <input type="checkbox" name="isTaxBenefitAvailable" checked={formData.isTaxBenefitAvailable} onChange={handleChange} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Yes, this campaign is tax-deductible</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Extended Gallery (More Photos)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <label style={{ 
                          width: '100px', 
                          height: '100px', 
                          border: '2px dashed var(--border)', 
                          borderRadius: '12px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}>
                          <PlusCircle size={24} style={{ color: 'var(--text-muted)' }} />
                          <input type="file" multiple onChange={(e) => handleFileUpload(e, 'images')} style={{ display: 'none' }} />
                        </label>
                        {formData.images.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                             <img src={img} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                             <button type="button" onClick={() => removeFile(idx, 'images')} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', border: 'none', padding: '2px', cursor: 'pointer' }}><X size={14} /></button>
                          </div>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form Navigation */}
          <div style={{ padding: '32px 40px', background: 'rgba(0,0,0,0.02)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <button 
              type="button" 
              onClick={() => setStep(step - 1)} 
              disabled={step === 1 || loading}
              className="btn-primary" 
              style={{ background: 'white', color: 'var(--text-main)', border: '1px solid var(--border)', opacity: step === 1 ? 0.5 : 1 }}
            >
              <ArrowLeft size={18} /> Previous
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary" 
              style={{ minWidth: '160px', justifyContent: 'center' }}
            >
              {loading ? 'Processing...' : (
                <>
                  {step === 4 ? 'Launch Campaign' : 'Continue'} 
                  {step < 4 && <ArrowRight size={18} />}
                  {step === 4 && <Send size={18} />}
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '24px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600' }}
          >
            <AlertCircle size={20} /> {error}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CreateDrive;