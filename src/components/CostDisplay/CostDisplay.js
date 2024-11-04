import React from 'react';
import { motion } from 'framer-motion';
import './CostDisplay.css';

const CostDisplay = ({ costs }) => {
  if (!costs) return null;

  return (
    <motion.div 
      className="cost-display"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h4>Generation Cost</h4>
      <div className="cost-grid">
        <div className="cost-item">
          <span>Template Input Tokens:</span>
          <span>{costs.inputTokens}</span>
        </div>
        <div className="cost-item">
          <span>Template Output Tokens:</span>
          <span>{costs.outputTokens}</span>
        </div>
        <div className="cost-item">
          <span>Image Query Input Tokens:</span>
          <span>{costs.imageQueryInputTokens}</span>
        </div>
        <div className="cost-item">
          <span>Image Query Output Tokens:</span>
          <span>{costs.imageQueryOutputTokens}</span>
        </div>
        <div className="cost-item">
          <span>Template Input Cost:</span>
          <span>${costs.inputCost}</span>
        </div>
        <div className="cost-item">
          <span>Template Output Cost:</span>
          <span>${costs.outputCost}</span>
        </div>
        <div className="cost-item">
          <span>Image Query Input Cost:</span>
          <span>${costs.imageQueryInputCost}</span>
        </div>
        <div className="cost-item">
          <span>Image Query Output Cost:</span>
          <span>${costs.imageQueryOutputCost}</span>
        </div>
        <div className="cost-item total">
          <span>Total Cost:</span>
          <span>${costs.totalCost}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CostDisplay; 