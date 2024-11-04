import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './BrandingManager.css';

const BrandingManager = ({ onLogoChange, onSignatureChange }) => {
  const [logo, setLogo] = useState(null);
  const [signature, setSignature] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        onLogoChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result);
        onSignatureChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      className="branding-manager"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Branding</h3>
      
      <div className="upload-section">
        <div className="upload-group">
          <label>Company Logo</label>
          <p className="field-description">Upload your company logo (PNG or JPG)</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
          />
          {logo && (
            <div className="preview-image">
              <img src={logo} alt="Company Logo" />
            </div>
          )}
        </div>

        <div className="upload-group">
          <label>Signature</label>
          <p className="field-description">Upload your signature (PNG or JPG)</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleSignatureUpload}
          />
          {signature && (
            <div className="preview-image">
              <img src={signature} alt="Signature" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BrandingManager; 