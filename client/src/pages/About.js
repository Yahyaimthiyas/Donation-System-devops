import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  Globe,
  Zap
} from 'lucide-react';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const values = [
    {
      icon: <ShieldCheck size={32} className="text-secondary" />,
      title: "Radical Transparency",
      desc: "Every rupee is tracked. We provide real-time updates on how contributions are utilized."
    },
    {
      icon: <Users size={32} className="text-primary" />,
      title: "Community Driven",
      desc: "Our platform is built on the power of collective action, connecting thousands of souls."
    },
    {
      icon: <Zap size={32} style={{ color: '#f59e0b' }} />,
      title: "Zero Friction",
      desc: "Launching a drive or donating takes seconds. Impact shouldn't wait for bureaucracy."
    }
  ];

  return (
    <motion.div 
      className="page-transition-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ paddingBottom: '100px' }}
    >
      {/* Hero Header */}
      <section style={{ 
        padding: '100px 0 60px', 
        textAlign: 'center', 
        background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.05) 0%, rgba(255, 255, 255, 0) 100%)' 
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <motion.div variants={itemVariants} style={{ display: 'inline-flex', padding: '12px', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-md)', color: 'var(--primary)', marginBottom: '24px' }}>
            <Heart size={32} fill="currentColor" />
          </motion.div>
          <motion.h1 variants={itemVariants} style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', letterSpacing: '-0.02em' }}>
            Transforming Kindness into <span className="text-gradient">Real Impact</span>
          </motion.h1>
          <motion.p variants={itemVariants} style={{ fontSize: '20px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            We are a global community platform dedicated to dismantling barriers to giving. 
            Through technology and transparency, we empower you to change lives.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container" style={{ marginBottom: '100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <motion.div variants={itemVariants}>
             <div style={{ padding: '40px', background: 'white', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>Our Mission</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '20px', lineHeight: '1.7' }}>
                  The Donation Platform was born from a simple observation: people want to help, but they often lack trust in where their money goes.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.7' }}>
                  We prioritize **end-to-end transparency**. By providing beneficiaries with a platform to document their journey and donors with real-time analytics, we bridge the gap of trust with technology.
                </p>
             </div>
          </motion.div>
          <motion.div variants={itemVariants} style={{ position: 'relative' }}>
             <img 
               src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop" 
               alt="Mission" 
               style={{ width: '100%', borderRadius: '24px', boxShadow: 'var(--shadow-xl)' }}
             />
             <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', padding: '24px', background: 'var(--primary)', color: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
                <Globe size={40} />
             </div>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="container" style={{ marginBottom: '100px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: '800', marginBottom: '60px' }}>What Defines Us</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {values.map((v, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="glass-card"
              style={{ padding: '40px', textAlign: 'center' }}
            >
              <div style={{ marginBottom: '24px', display: 'inline-block' }}>{v.icon}</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>{v.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container">
        <motion.div 
          variants={itemVariants}
          style={{ 
            background: 'var(--text-main)', 
            color: 'white', 
            borderRadius: '32px', 
            padding: '80px 40px', 
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '20px' }}>Ready to make history?</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '20px', maxWidth: '600px', margin: '0 auto 40px' }}>
               Join thousands of donors and creators today. Together, we can change the world one drive at a time.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <Link to="/register" className="btn-primary" style={{ padding: '16px 32px' }}>
                Start Your Journey <ArrowRight size={20} />
              </Link>
              <Link to="/drives" style={{ padding: '16px 32px', borderRadius: '12px', background: 'white', color: 'var(--text-main)', fontWeight: '700' }}>
                Explore Active Drives
              </Link>
            </div>
          </div>
          {/* Subtle background glow */}
          <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        </motion.div>
      </section>
    </motion.div>
  );
};

export default About;