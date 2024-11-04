import React from 'react';
import { motion } from 'framer-motion';
import './LoadingIndicator.css';

const LoadingIndicator = ({ status, progress }) => {
  return (
    <div className="loading-overlay">
      <motion.div 
        className="loading-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="loading-spinner"></div>
        <h3>Generating Template...</h3>
        <div className="loading-status">{status}</div>
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="progress-text">{progress}% Complete</div>
      </motion.div>
    </div>
  );
};

export default LoadingIndicator; 