import React, { useState } from 'react';
import { motion } from 'framer-motion';
import InvoiceForm from '../InvoiceForm/InvoiceForm';
import InvoicePreview from '../InvoicePreview/InvoicePreview';
import BrandingManager from '../BrandingManager/BrandingManager';
import './DocumentCreator.css';

const DocumentCreator = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    date: '',
    dueDate: '',
    clientName: '',
    clientEmail: '',
    items: [],
    selectedTemplate: 'default',
    projectScope: '',
    terms: '',
    logo: '',
    signature: ''
  });

  const handleLogoChange = (logoUrl) => {
    setInvoiceData(prev => ({
      ...prev,
      logo: logoUrl
    }));
  };

  const handleSignatureChange = (signatureUrl) => {
    setInvoiceData(prev => ({
      ...prev,
      signature: signatureUrl
    }));
  };

  return (
    <motion.main 
      className="App-main"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <form>
        <div className="left-column">
          <InvoiceForm 
            invoiceData={invoiceData} 
            setInvoiceData={setInvoiceData} 
          />
          <BrandingManager
            onLogoChange={handleLogoChange}
            onSignatureChange={handleSignatureChange}
          />
        </div>
        <div className="right-column">
          <InvoicePreview invoiceData={invoiceData} />
        </div>
      </form>
    </motion.main>
  );
};

export default DocumentCreator; 