import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './InvoiceForm.css';
import InvoiceItems from '../InvoiceItems/InvoiceItems';
import { templateManager } from '../../templates/templateManager';

const InvoiceForm = ({ invoiceData, setInvoiceData }) => {
  const [uploadConfig, setUploadConfig] = useState({
    type: 'invoice',
    file: null,
    fileContent: null
  });

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadConfig(prev => ({
          ...prev,
          file: file,
          fileContent: e.target.result
        }));
      };
      reader.readAsText(file);
    }
  };

  const handleCreateTemplate = async () => {
    if (uploadConfig.file && uploadConfig.fileContent) {
      const templateName = `custom-${uploadConfig.type}-${Date.now()}`;
      const success = await templateManager.addTemplate(templateName, uploadConfig.file, {
        type: uploadConfig.type,
        content: uploadConfig.fileContent
      });
      
      if (success) {
        if (uploadConfig.type === 'sow') {
          setInvoiceData({
            ...invoiceData,
            selectedTemplate: templateName,
            projectScope: '',
            terms: '',
            customTemplate: templateName
          });
        } else {
          setInvoiceData({
            ...invoiceData,
            selectedTemplate: templateName
          });
        }
        
        setUploadConfig({
          type: 'invoice',
          file: null,
          fileContent: null
        });
      }
    }
  };

  const isSOW = 
    invoiceData.selectedTemplate === 'sow' || 
    uploadConfig.type === 'sow' || 
    (invoiceData.customTemplate && invoiceData.customTemplate.includes('-sow-'));

  useEffect(() => {
    if (uploadConfig.type === 'sow') {
      setInvoiceData(prev => ({
        ...prev,
        projectScope: prev.projectScope || '',
        terms: prev.terms || ''
      }));
    }
  }, [uploadConfig.type, setInvoiceData]);

  const formAnimation = {
    hidden: { 
      opacity: 0, 
      x: -100,
      rotateY: -10,
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        duration: 1,
        bounce: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { 
      opacity: 0, 
      x: -50,
      y: 20
    },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.4
      }
    }
  };

  return (
    <motion.div 
      className="invoice-form"
      initial="hidden"
      animate="visible"
      variants={formAnimation}
      transition={{ duration: 0.3 }}
    >
      <motion.div className="template-selection" variants={itemAnimation}>
        <h3>Document Type</h3>
        <p className="field-description">Choose the type of document to generate</p>
        <select 
          value={invoiceData.selectedTemplate}
          onChange={(e) => {
            const newTemplate = e.target.value;
            if (newTemplate === 'custom') {
              setInvoiceData({
                ...invoiceData,
                selectedTemplate: newTemplate,
                customTemplate: null
              });
            } else {
              setInvoiceData({
                ...invoiceData,
                selectedTemplate: newTemplate,
                ...(newTemplate === 'sow' && {
                  projectScope: '',
                  terms: ''
                })
              });
            }
          }}
        >
          <option value="default">Invoice</option>
          <option value="sow">Statement of Work</option>
          <option value="custom">Upload Custom Template</option>
        </select>
        
        {invoiceData.selectedTemplate === 'custom' && (
          <motion.div 
            className="template-upload-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="template-type-selection">
              <h4>Template Type</h4>
              <select
                value={uploadConfig.type}
                onChange={(e) => setUploadConfig(prev => ({
                  ...prev,
                  type: e.target.value
                }))}
              >
                <option value="invoice">Invoice Template</option>
                <option value="sow">Statement of Work Template</option>
              </select>
            </div>

            <div className="template-file-upload">
              <h4>Upload Template</h4>
              <p className="field-description">Upload an HTML template file</p>
              <input 
                type="file" 
                accept=".html,.htm" 
                onChange={handleFileSelect}
              />
              {uploadConfig.file && (
                <motion.button
                  type="button"
                  className="create-template-button"
                  onClick={handleCreateTemplate}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create {uploadConfig.type === 'sow' ? 'SOW' : 'Invoice'} Template
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div className="invoice-details" variants={itemAnimation}>
        <motion.div className="form-group" variants={itemAnimation}>
          <label htmlFor="invoiceNumber">
            {isSOW ? 'SOW Number' : 'Invoice Number'}
          </label>
          <p className="field-description">
            {isSOW ? 'Unique identifier for this SOW' : 'Unique identifier for this invoice'}
          </p>
          <input
            id="invoiceNumber"
            type="text"
            placeholder={isSOW ? "e.g., SOW-001" : "e.g., INV-001"}
            value={invoiceData.invoiceNumber}
            onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
          />
        </motion.div>

        <motion.div className="form-group" variants={itemAnimation}>
          <label htmlFor="date">
            {isSOW ? 'Start Date' : 'Invoice Date'}
          </label>
          <p className="field-description">
            {isSOW ? 'Project start date' : 'Date of invoice creation'}
          </p>
          <input
            id="date"
            type="date"
            value={invoiceData.date}
            onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
          />
        </motion.div>

        <motion.div className="form-group" variants={itemAnimation}>
          <label htmlFor="dueDate">
            {isSOW ? 'End Date' : 'Due Date'}
          </label>
          <p className="field-description">
            {isSOW ? 'Project end date' : 'Payment due date'}
          </p>
          <input
            id="dueDate"
            type="date"
            value={invoiceData.dueDate}
            onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
          />
        </motion.div>

        {isSOW && (
          <motion.div className="form-group" variants={itemAnimation}>
            <label htmlFor="projectScope">Project Scope</label>
            <p className="field-description">Brief description of the project scope</p>
            <textarea
              id="projectScope"
              value={invoiceData.projectScope || ''}
              onChange={(e) => setInvoiceData({...invoiceData, projectScope: e.target.value})}
              rows="4"
              placeholder="Describe the scope of work..."
            />
          </motion.div>
        )}

        <motion.div className="form-group" variants={itemAnimation}>
          <label htmlFor="clientName">Client Name</label>
          <p className="field-description">Full name of the client or company</p>
          <input
            id="clientName"
            type="text"
            placeholder="e.g., John Doe"
            value={invoiceData.clientName}
            onChange={(e) => setInvoiceData({...invoiceData, clientName: e.target.value})}
          />
        </motion.div>

        <motion.div className="form-group" variants={itemAnimation}>
          <label htmlFor="clientEmail">Client Email</label>
          <p className="field-description">Email address where invoice will be sent</p>
          <input
            id="clientEmail"
            type="email"
            placeholder="e.g., client@example.com"
            value={invoiceData.clientEmail}
            onChange={(e) => setInvoiceData({...invoiceData, clientEmail: e.target.value})}
          />
        </motion.div>
      </motion.div>

      <InvoiceItems 
        items={invoiceData.items} 
        setInvoiceData={setInvoiceData}
        invoiceData={invoiceData}
        isSOW={isSOW}
      />

      {isSOW && (
        <motion.div className="form-group" variants={itemAnimation}>
          <label htmlFor="terms">Terms and Conditions</label>
          <p className="field-description">Specify any special terms or conditions</p>
          <textarea
            id="terms"
            value={invoiceData.terms || ''}
            onChange={(e) => setInvoiceData({...invoiceData, terms: e.target.value})}
            rows="4"
            placeholder="Enter terms and conditions..."
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default InvoiceForm;