import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navigation.css';

const Navigation = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <motion.nav 
      className="navigation"
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
      
      <div className="nav-links">
        <Link to="/">Document Creator</Link>
        <Link to="/template-generator">Template Generator</Link>
        <button 
          onClick={toggleDarkMode}
          className="theme-toggle"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </motion.nav>
  );
};

export default Navigation; 