import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  LayoutDashboard, 
  Bell, 
  LogOut, 
  User as UserIcon, 
  PlusCircle, 
  Menu,
  X,
  Award,
  Trophy,
  CircleUser,
  BarChart3
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, notifications } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navStyles = {
    fixed: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: isScrolled ? '12px 0' : '20px 0',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(16px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.05)' : 'none',
    },
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    navLink: {
      fontSize: '15px',
      fontWeight: '600',
      color: 'var(--text-main)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'color 0.2s',
      textDecoration: 'none'
    }
  };

  const NavLinks = ({ isMobile = false }) => (
    <>
      {user?.role !== 'admin' && (
        <>
          <Link to="/drives" className={isMobile ? "drawer-link" : ""} style={!isMobile ? navStyles.navLink : {}}>
            {isMobile && <Heart size={20} />} Drives
          </Link>
          <Link to="/leaderboard" className={isMobile ? "drawer-link" : ""} style={!isMobile ? navStyles.navLink : {}}>
            {isMobile ? <Trophy size={20} /> : <Award size={18} />} Leaderboard
          </Link>
        </>
      )}
      
      {user ? (
        <>
          {user.role === 'admin' && (
            <>
              <Link to="/admin" className={isMobile ? "drawer-link" : ""} style={!isMobile ? navStyles.navLink : {}}>
                <LayoutDashboard size={isMobile ? 20 : 18} /> Dashboard
              </Link>
              <Link to="/reports" className={isMobile ? "drawer-link" : ""} style={!isMobile ? navStyles.navLink : {}}>
                <BarChart3 size={isMobile ? 20 : 18} /> Reports
              </Link>
            </>
          )}
          {user.role === 'beneficiary' && (
            <>
              <Link to="/create-drive" className={isMobile ? "drawer-link" : ""} style={!isMobile ? navStyles.navLink : {}}>
                 <PlusCircle size={isMobile ? 20 : 18} /> Create
              </Link>
              <Link to="/my-drives" className={isMobile ? "drawer-link" : ""} style={!isMobile ? navStyles.navLink : {}}>
                 <LayoutDashboard size={isMobile ? 20 : 18} /> My Campaigns
              </Link>
            </>
          )}
          
          <Link to="/notifications" className={isMobile ? "drawer-link" : ""} style={!isMobile ? { ...navStyles.navLink, position: 'relative' } : { position: 'relative' }}>
            <Bell size={isMobile ? 20 : 18} /> {isMobile && "Notifications"}
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: isMobile ? 'auto' : '-5px',
                left: isMobile ? '32px' : 'auto',
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--error)',
                borderRadius: '50%',
                border: '2px solid white'
              }} />
            )}
          </Link>

          {user.role !== 'admin' && (
            <Link to="/profile" className={isMobile ? "drawer-link" : ""} style={!isMobile ? navStyles.navLink : {}}>
              {isMobile ? <CircleUser size={20} /> : <UserIcon size={18} />} Profile
            </Link>
          )}
          
          <button 
            onClick={handleLogout}
            className={isMobile ? "drawer-link" : ""}
            style={{
              ...(!isMobile ? navStyles.navLink : {}),
              background: 'none',
              color: 'var(--error)',
              width: isMobile ? '100%' : 'auto',
              textAlign: 'left'
            }}
          >
            <LogOut size={isMobile ? 20 : 18} /> Logout
          </button>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px', alignItems: 'center', marginTop: isMobile ? '20px' : 0 }}>
          <Link to="/login" className={isMobile ? "drawer-link" : ""} style={!isMobile ? navStyles.navLink : {}}>
            Login
          </Link>
          <Link to="/register" className="btn-primary" style={{ padding: '11px 24px', fontSize: '14px' }}>
            Get Started
          </Link>
        </div>
      )}
    </>
  );

  return (
    <>
      <nav style={navStyles.fixed}>
        <div className="container" style={navStyles.container}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-1px' }}>
            <div style={{ padding: '6px', background: 'var(--primary)', color: 'white', borderRadius: '10px' }}>
              <Heart size={24} fill="currentColor" />
            </div>
            <span className="hide-mobile">CharityConnect</span>
          </Link>

          {/* Desktop Menu */}
          <div className="nav-desktop" style={{ gap: '24px', alignItems: 'center' }}>
            <NavLinks />
          </div>

          {/* Mobile Toggle */}
          <button 
            className="nav-mobile-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ 
              background: 'white', 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border)'
            }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="drawer-overlay"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="mobile-drawer"
            >
              <div style={{ marginBottom: '32px' }}>
                <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', fontWeight: '800', color: 'var(--primary)' }}>
                  <Heart size={24} fill="currentColor" /> CharityConnect
                </Link>
              </div>
              <NavLinks isMobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;