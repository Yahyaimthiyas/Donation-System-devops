import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Heart, Globe, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import heroImage from '../assets/charity_hero_modern.png'; // Note: Ensure the image is moved to assets

const Home = () => {
  const { user } = useContext(AuthContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const features = [
    {
      icon: <Globe className="text-primary" size={24} />,
      title: "Global Impact",
      desc: "Connect with communities in need across the world through transparent drives."
    },
    {
      icon: <ShieldCheck className="text-secondary" size={24} />,
      title: "Secure Giving",
      desc: "Every donation is tracked and verified to ensure it reaches the right hands."
    },
    {
      icon: <TrendingUp className="text-primary" size={24} />,
      title: "Real-time Tracking",
      desc: "Monitor your impact with live updates and transparency reports."
    }
  ];

  return (
    <motion.div 
      className="page-transition-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <section style={{ 
        padding: '80px 0', 
        background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
        textAlign: 'center'
      }}>
        <div className="container">
          <motion.div variants={itemVariants}>
            <span style={{ 
              display: 'inline-block', 
              padding: '6px 16px', 
              borderRadius: '20px', 
              background: 'rgba(99, 102, 241, 0.1)', 
              color: 'var(--primary)',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '24px'
            }}>
              ✨ Empowering lives through collective action
            </span>
            <h1 style={{ maxWidth: '800px', margin: '0 auto 24px' }}>
              Where compassion meets <span className="text-gradient">Real Impact</span>
            </h1>
            <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
              Join CharityConnect and be part of a transparent, secure, and world-changing donation platform. Every contribution matters.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              {user ? (
                <Link to="/drives" className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }}>
                  Explore Drives <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }}>
                    Start Gifting <ArrowRight size={20} />
                  </Link>
                  <Link to="/about" style={{ 
                    padding: '14px 32px', 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Our Mission
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} style={{ marginTop: '60px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(255,255,255,0) 70%)',
                zIndex: -1
              }} />
              <img 
                src={heroImage} 
                alt="Global Connection" 
                style={{ 
                  maxWidth: '1000px', 
                  width: '100%', 
                  borderRadius: 'clamp(16px, 4vw, 32px)', 
                  boxShadow: 'var(--shadow-lg)',
                  border: 'clamp(4px, 1vw, 8px) solid white'
                }} 
              />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Why donors trust us</h2>
            <p style={{ color: 'var(--text-muted)' }}>Transparent, secure, and community-driven excellence.</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px' 
          }}>
            {features.map((f, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="glass-card"
                style={{ padding: '40px', textAlign: 'left', transition: 'transform 0.3s ease' }}
                whileHover={{ y: -10 }}
              >
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '16px', 
                  background: 'rgba(99, 102, 241, 0.05)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding" style={{ background: 'var(--background)' }}>
        <div className="container">
           <div className="glass-card stats-grid" style={{ 
             padding: 'clamp(32px, 8vw, 60px)',
             background: 'var(--text-main)',
             color: 'white'
           }}>
              <div>
                <h4 style={{ fontSize: '40px', fontWeight: 'bold', color: 'var(--secondary)', marginBottom: '8px' }}>₹25L+</h4>
                <p style={{ opacity: 0.7 }}>Total Funds Raised</p>
              </div>
              <div>
                <h4 style={{ fontSize: '40px', fontWeight: 'bold', color: 'var(--secondary)', marginBottom: '8px' }}>12k+</h4>
                <p style={{ opacity: 0.7 }}>Global Donors</p>
              </div>
              <div>
                <h4 style={{ fontSize: '40px', fontWeight: 'bold', color: 'var(--secondary)', marginBottom: '8px' }}>450+</h4>
                <p style={{ opacity: 0.7 }}>Drives Completed</p>
              </div>
              <div>
                <h4 style={{ fontSize: '40px', fontWeight: 'bold', color: 'var(--secondary)', marginBottom: '8px' }}>50+</h4>
                <p style={{ opacity: 0.7 }}>Partner Charities</p>
              </div>
           </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;