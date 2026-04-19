import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  Clock, 
  MessageSquare,
  CheckCircle2
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 5000);
  };

  const contactInfo = [
    { icon: <Mail size={24} />, title: "Email Support", detail: "support@donationimpact.org", link: "mailto:support@donationimpact.org" },
    { icon: <MapPin size={24} />, title: "HQ Location", detail: "Tech Hub, Silicon Square, IN", link: "#" },
    { icon: <Phone size={24} />, title: "Call Center", detail: "+91 (800) 123-4567", link: "tel:+918001234567" }
  ];

  return (
    <motion.div 
      className="page-transition-wrapper container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '100px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '80px', paddingTop: '60px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '16px' }}>Get in <span className="text-gradient">Touch</span></h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '20px', maxWidth: '600px', margin: '0 auto' }}>
          Have questions about a drive or technical issues? Our team is here to help you make an impact.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '60px', alignItems: 'start' }}>
        
        {/* Left Column: Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {contactInfo.map((item, i) => (
            <motion.a 
              key={i}
              href={item.link}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 10 }}
              className="glass-card"
              style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{item.detail}</p>
              </div>
            </motion.a>
          ))}

          <div className="glass-card" style={{ padding: '32px', background: 'var(--primary)', color: 'white' }}>
             <Clock size={32} style={{ marginBottom: '16px' }} />
             <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Support Hours</h3>
             <p style={{ opacity: 0.8, fontSize: '15px', lineHeight: '1.6' }}>
               Monday — Friday: 9am - 6pm IST<br />
               Weekend: Emergency Priority Support
             </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="glass-card" style={{ padding: '40px' }}>
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <MessageSquare size={20} className="text-secondary" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Drop a Message</h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="John Doe" 
                  required 
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="john@example.com" 
                  required 
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none' }} 
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Message Details</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="How can we help you today?" 
                rows="6" 
                required 
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none', resize: 'vertical' }} 
              />
            </div>
            
            <motion.button 
              type="submit" 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '16px', gap: '10px' }}
            >
              {submitted ? <><CheckCircle2 size={20} /> Sent Successfully</> : <><Send size={20} /> Send Inquiry</>}
            </motion.button>
          </form>
        </div>

      </div>
    </motion.div>
  );
};

export default Contact;