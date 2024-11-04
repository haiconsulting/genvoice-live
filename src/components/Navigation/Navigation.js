import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navigation.css';

const Navigation = ({ isDarkMode, toggleDarkMode }) => {
  const location = useLocation();

  return (
    <motion.header 
      className="App-header"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="header-content">
        <h1>GenVoice</h1>
        <nav className="main-nav">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Document Creator
          </Link>
          <Link 
            to="/template-generator" 
            className={location.pathname === '/template-generator' ? 'active' : ''}
          >
            Template Generator
          </Link>
        </nav>
        <motion.button
          className="theme-toggle"
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Navigation; 