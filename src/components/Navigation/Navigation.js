import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navigation.css';

const Navigation = ({ isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
      if (isMenuOpen) setIsMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, isMenuOpen]);

  return (
    <motion.nav 
      className={`navigation ${visible ? '' : 'nav-hidden'}`}
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-brand">
        <img 
          src={`${process.env.PUBLIC_URL}/favicon.ico`} 
          alt="GenVoice Logo" 
          className="nav-logo"
        />
        <h1>GenVoice</h1>
      </div>
      
      <div className="mobile-menu">
        <button 
          className="hamburger-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <AnimatePresence>
        {(isMenuOpen || window.innerWidth > 768) && (
          <motion.div 
            className={`nav-links ${isMenuOpen ? 'mobile-active' : ''}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="nav-button" onClick={() => setIsMenuOpen(false)}>
              Document Creator
            </Link>
            <Link to="/template-generator" className="nav-button" onClick={() => setIsMenuOpen(false)}>
              Template Generator
            </Link>
            <button 
              onClick={() => {
                toggleDarkMode();
                setIsMenuOpen(false);
              }}
              className="theme-toggle"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;