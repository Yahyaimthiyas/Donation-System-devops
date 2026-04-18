import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Plus, 
  Minus, 
  Search, 
  LifeBuoy, 
  ShieldCheck, 
  CreditCard, 
  Users 
} from 'lucide-react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { 
      category: 'General',
      icon: <HelpCircle size={18} />,
      q: 'How do I create a donation drive?', 
      a: 'As a beneficiary, once logged in, navigate to "Start Campaign" in your dashboard. Fill out the comprehensive form including your mission, monetary goals, essential items, and high-quality photos. Once submitted, our team will review it within 24 hours.' 
    },
    { 
      category: 'Donors',
      icon: <CreditCard size={18} />,
      q: 'Can I donate both money and physical items?', 
      a: 'Absolutely! Our platform is a hybrid transparency system. When you click "Donate" on a drive, you can choose to contribute financially via our secure gateway or commit to delivering specific physical items listed as "Essential Needs" by the beneficiary.' 
    },
    { 
      category: 'Safety',
      icon: <ShieldCheck size={18} />,
      q: 'How are donations tracked and verified?', 
      a: 'Transparency is our core value. Every financial contribution is instantly recorded against the drive’s progress bar. Beneficiaries are required to upload "Impact Proof" (photos and receipts) which are subsequently notified to all backers of that specific drive.' 
    },
    { 
      category: 'Participation',
      icon: <Users size={18} />,
      q: 'Is there a limit to how many drives I can support?', 
      a: 'There is no limit. You can support as many causes as you wish. Your "Hall of Fame" ranking will improve with every verified contribution, celebrating your impact within our community.' 
    },
    { 
      category: 'Support',
      icon: <LifeBuoy size={18} />,
      q: 'What happens if a drive doesn’t reach its goal?', 
      a: 'Unlike other platforms, we operate on a "Partial Impact" model. Every rupee raised is still vital. The funds collected are disbursed to the beneficiary to fulfill as much of the mission as possible, with full reporting on the adjusted impact.' 
    }
  ];

  const AccordionItem = ({ faq, index }) => {
    const isOpen = activeIndex === index;
    return (
      <div 
        className="glass-card" 
        style={{ 
          marginBottom: '16px', 
          overflow: 'hidden', 
          border: isOpen ? '1px solid var(--primary-light)' : '1px solid var(--border)',
          background: isOpen ? 'white' : 'rgba(255,255,255,0.7)'
        }}
      >
        <button 
          onClick={() => setActiveIndex(isOpen ? null : index)}
          style={{ 
            width: '100%', 
            padding: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: isOpen ? 'var(--primary)' : 'rgba(0,0,0,0.05)', 
              color: isOpen ? 'white' : 'var(--text-muted)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}>
              {faq.icon}
            </div>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>{faq.category}</span>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>{faq.q}</h3>
            </div>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            {isOpen ? <Minus size={20} /> : <Plus size={20} />}
          </div>
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div style={{ padding: '0 24px 24px 76px', color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '16px' }}>
                {faq.a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div 
      className="page-transition-wrapper container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '100px', maxWidth: '900px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '80px', paddingTop: '60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '700', fontSize: '14px', marginBottom: '16px', background: 'rgba(99, 102, 241, 0.1)', padding: '6px 16px', borderRadius: '20px' }}>
          <HelpCircle size={18} /> SUPPORT CENTER
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px' }}>Common <span className="text-gradient">Questions</span></h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '20px', maxWidth: '600px', margin: '0 auto' }}>
          Everything you need to know about starting drives, donating, and our transparency mission.
        </p>
      </div>

      <div style={{ marginBottom: '60px' }}>
        {faqs.map((faq, index) => (
          <AccordionItem key={index} faq={faq} index={index} />
        ))}
      </div>

      <div className="glass-card" style={{ padding: '40px', textAlign: 'center', background: 'var(--text-main)', color: 'white' }}>
         <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Still have questions?</h3>
         <p style={{ opacity: 0.7, marginBottom: '24px' }}>If you couldn't find your answer here, our team is ready to assist you personally.</p>
         <button className="btn-primary" style={{ margin: '0 auto', background: 'white', color: 'var(--text-main)' }}>Contact Support Team</button>
      </div>
    </motion.div>
  );
};

export default FAQ;