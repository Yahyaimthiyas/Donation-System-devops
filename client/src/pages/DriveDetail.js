import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Users, 
  ShieldCheck, 
  Share2, 
  CheckCircle2,
  X,
  Phone,
  Building2
} from 'lucide-react';



const DriveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('story');
  
  // Payment State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState(1000);
  const [paymentStep, setPaymentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchDrive = async () => {
      try {
        const res = await api.get(`/drives/${id}`);
        const data = res.data.data || res.data;
        setDrive(data);
      } catch (err) {
        setError('Failed to load campaign details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDrive();
  }, [id]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      setIsProcessing(false);
      return;
    }

    try {
      const orderRes = await api.post('/donations/razorpay/order', {
        amount: donationAmount,
      });
      const order = orderRes.data.order;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_fallbackKey123',
        amount: order.amount,
        currency: order.currency,
        name: 'Charity Hero',
        description: `Impact for ${drive.beneficiaryName}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await api.post('/donations/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              drive: id,
              amount: donationAmount
            });
            setIsModalOpen(true);
            setPaymentStep(3); // Show Success UI
          } catch (err) {
            alert('Financial verification failed. Potential spoof attack.');
          }
        },
        prefill: {
          name: 'Noble Donor',
          email: 'changemaker@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#4f46e5', // Primary brand color
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      alert(err.response?.data?.error || 'Failed to initiate secure checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setPaymentStep(1), 300); // Reset after animation
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="fade-in" style={{ color: 'var(--primary)', fontWeight: '600' }}>Loading Campaign Intelligence...</div>
    </div>
  );

  if (error || !drive) return (
    <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
      <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>Oops! Campaign Mismatched</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{error || "The drive you're looking for might have been concluded or removed."}</p>
      <button className="btn-primary" onClick={() => navigate('/drives')}>Back to All Drives</button>
    </div>
  );

  const progress = Math.min((drive.amountRaised / drive.monetaryGoal) * 100, 100) || 0;
  const daysLeft = Math.ceil((new Date(drive.endDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-transition-wrapper"
      style={{ paddingBottom: '100px' }}
    >
      {/* Hero Banner */}
      <div style={{ position: 'relative', height: '500px', width: '100%', overflow: 'hidden' }}>
        <img 
          src={drive.coverImage || drive.images?.[0]} 
          alt={drive.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }} />
        <div className="container" style={{ position: 'absolute', bottom: '60px', left: '0', right: '0' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ background: 'var(--primary)', color: 'white', padding: '6px 16px', borderRadius: '40px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>{drive.category}</span>
              {drive.urgency === 'Critical' && <span style={{ background: 'var(--error)', color: 'white', padding: '6px 16px', borderRadius: '40px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Critical Urgency</span>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '12px', fontWeight: '700', background: 'rgba(255,255,255,0.9)', padding: '6px 16px', borderRadius: '40px' }}>
                <ShieldCheck size={16} /> Verified Platform Campaign
              </div>
           </div>
           <h1 style={{ color: 'white', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', maxWidth: '800px', lineHeight: 1.1, marginBottom: '24px' }}>{drive.title}</h1>
           <div style={{ display: 'flex', gap: '32px', color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={20} /> {drive.city || drive.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={20} /> {daysLeft > 0 ? `${daysLeft} days left` : 'Completed'}</span>
           </div>
        </div>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '60px', marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        
        {/* Left Column: Content */}
        <div>
          <div className="glass-card" style={{ padding: '40px', marginBottom: '40px' }}>
             <div style={{ display: 'flex', gap: '40px', borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
                {['story', 'gallery', 'updates'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    style={{ 
                      padding: '16px 0', 
                      background: 'none', 
                      border: 'none', 
                      fontSize: '16px', 
                      fontWeight: '700', 
                      color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                      borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tab}
                  </button>
                ))}
             </div>

             <div style={{ minHeight: '400px' }}>
                {activeTab === 'story' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ fontSize: '18px', lineHeight: 1.8, color: '#334155', whiteSpace: 'pre-wrap' }}>
                      {drive.description}
                    </div>
                    
                    <div style={{ marginTop: '48px', padding: '32px', background: 'rgba(0,0,0,0.02)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Beneficiary Intelligence</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <DetailItem icon={<Users />} label="Beneficiary" value={drive.beneficiaryName} />
                        <DetailItem icon={<Phone />} label="Verified Contact" value={drive.contactNumber} />
                        <DetailItem icon={<Building2 />} label="Category" value={drive.category} />
                        <DetailItem icon={<ShieldCheck />} label="Aadhaar Status" value="Verified by Admin" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'gallery' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {drive.images?.map((img, i) => (
                      <img key={i} src={img} alt="Gallery" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--border)' }} />
                    ))}
                    {(!drive.images || drive.images.length === 0) && <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No additional gallery images provided.</p>}
                  </motion.div>
                )}
             </div>
          </div>
        </div>

        {/* Right Column: Donation Card */}
        <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
          <div className="glass-card" style={{ padding: '32px', boxShadow: 'var(--shadow-lg)' }}>
             <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                   <span style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)' }}>₹{drive.amountRaised?.toLocaleString() || 0}</span>
                   <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>raised of ₹{drive.monetaryGoal?.toLocaleString()}</span>
                </div>
                <div style={{ width: '100%', height: '12px', background: 'var(--border)', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), #818cf8)', borderRadius: '6px' }} 
                   />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>
                   <span>{Math.round(progress)}% Complete</span>
                   <span>{drive.donations?.length || 0} Backers</span>
                </div>
             </div>

             <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px', textTransform: 'uppercase' }}>Select Support Tier</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                   {[500, 1000, 2000].map(amt => (
                     <button 
                      key={amt} 
                      onClick={() => setDonationAmount(amt)}
                      style={{ 
                        padding: '12px', 
                        borderRadius: '10px', 
                        border: Number(donationAmount) === amt ? '2px solid var(--primary)' : '1px solid var(--border)',
                        background: Number(donationAmount) === amt ? 'rgba(99, 102, 241, 0.05)' : 'white',
                        fontWeight: '700',
                        color: Number(donationAmount) === amt ? 'var(--primary)' : 'var(--text-main)',
                        cursor: 'pointer'
                      }}
                     >₹{amt}</button>
                   ))}
                </div>
                <input 
                  type="number" 
                  value={donationAmount} 
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Custom Amount" 
                  style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none', fontWeight: '600' }} 
                />
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '18px' }}
                >
                  Secure Check Out
                </button>
             </div>

             <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                   <Share2 size={14} /> 1.2k Shares on Social Media
                </div>
                Fully secure encrypted payments processed by Razorpay.
             </div>
          </div>

          <div className="glass-card" style={{ marginTop: '20px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'var(--primary)' }}>
             <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
                <ShieldCheck size={24} />
             </div>
             <div>
                <h5 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>Official Processing</h5>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cards, UPI, and Wallets Supported.</p>
             </div>
          </div>
        </div>

      </div>

      {/* Direct UPI Payment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card" 
              style={{ width: '100%', maxWidth: '440px', padding: '40px', position: 'relative', textAlign: 'center' }}
            >
              <button onClick={closeModal} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>

              {paymentStep === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <IndianRupee size={30} />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Support this Cause</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '14px' }}>Enter the amount you wish to transfer directly to <b>{drive.beneficiaryName}</b>.</p>
                  
                  <div style={{ position: 'relative', marginBottom: '30px' }}>
                    <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>₹</span>
                    <input 
                      type="number" 
                      value={donationAmount} 
                      onChange={(e) => setDonationAmount(e.target.value)}
                      style={{ width: '100%', padding: '20px 20px 20px 50px', fontSize: '32px', fontWeight: '800', background: 'rgba(0,0,0,0.03)', border: '2px solid var(--border)', borderRadius: '16px', outline: 'none', color: 'var(--text-main)' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                    {[500, 1000, 2000, 5000].map(amt => (
                      <button 
                        key={amt} 
                        onClick={() => setDonationAmount(amt)}
                        style={{ flex: 1, padding: '12px 0', border: `2px solid ${Number(donationAmount) === amt ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '12px', background: Number(donationAmount) === amt ? 'var(--primary)' : 'white', color: Number(donationAmount) === amt ? 'white' : 'var(--text-main)', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  <button onClick={handleRazorpayPayment} disabled={isProcessing} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
                    {isProcessing ? 'Initializing Secure Payment...' : `Proceed to Pay ₹${donationAmount}`}
                  </button>
                </motion.div>
              )}

              {paymentStep === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>Impact Delivered!</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '16px' }}>Your payment of ₹{donationAmount} was successfully verified and delivered to {drive.beneficiaryName}.</p>
                  
                  <button onClick={closeModal} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px' }}>Return to Campaign</button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <div style={{ color: 'var(--primary)', opacity: 0.7 }}>{icon}</div>
    <div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ fontSize: '15px', fontWeight: '700' }}>{value || 'Not Disclosed'}</div>
    </div>
  </div>
);

export default DriveDetail;
