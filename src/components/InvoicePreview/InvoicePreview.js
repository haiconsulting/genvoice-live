import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';
import './InvoicePreview.css';
import { templateManager } from '../../templates/templateManager';

const InvoicePreview = ({ invoiceData, onTemplateChange }) => {
  const editorRef = useRef(null);

  const calculateTotal = () => {
    return invoiceData.items.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
  };

  const template = templateManager.getTemplate(invoiceData.selectedTemplate || 'default');
  const initialContent = template.render(invoiceData, calculateTotal);
  
  const isSOW = ((invoiceData.selectedTemplate === 'sow') || 
                (invoiceData.selectedTemplate.startsWith('custom-') && 
                 invoiceData.selectedTemplate.includes('-sow-'))) || false;

  const handleEditorChange = (content) => {
    if (onTemplateChange) {
      onTemplateChange(content);
    }
  };

  const handleDownload = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isSOW ? 'Statement of Work' : 'Invoice'} #${invoiceData.invoiceNumber}</title>
    <style>
      body { font-family: Arial, sans-serif; }
      img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;

      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${isSOW ? 'SOW' : 'Invoice'}_${invoiceData.invoiceNumber || 'draft'}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const handleSaveAsTemplate = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      
      // Replace actual values with template placeholders
      let templateContent = content;
      
      // Create a safe list of replacements
      const replacements = [
        { value: invoiceData.invoiceNumber, key: 'invoiceNumber' },
        { value: invoiceData.date, key: 'date' },
        { value: invoiceData.dueDate, key: 'dueDate' },
        { value: invoiceData.clientName, key: 'clientName' },
        { value: invoiceData.clientEmail, key: 'clientEmail' },
        { value: invoiceData.projectScope, key: 'projectScope' },
        { value: invoiceData.terms, key: 'terms' }
      ];
  
      // Safely replace each value
      replacements.forEach(({ value, key }) => {
        if (value && typeof value === 'string') {
          const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          templateContent = templateContent.replace(
            new RegExp(escapedValue, 'g'),
            `{{${key}}}`
          );
        }
      });

      // Create template name
      const templateName = `custom-${isSOW ? 'sow' : 'invoice'}-${Date.now()}`;
      
      try {
        // Create full HTML document
        const fullHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom ${isSOW ? 'SOW' : 'Invoice'} Template</title>
    <style>
      body { font-family: Arial, sans-serif; }
      img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    ${templateContent}
</body>
</html>`;

        // Save to template manager
        await templateManager.addTemplate(templateName, new Blob([fullHtmlContent], { type: 'text/html' }), {
          type: isSOW ? 'sow' : 'invoice',
          content: templateContent
        });

        // Download the template file
        const blob = new Blob([fullHtmlContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${templateName}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        alert('Template saved successfully! You can now use it in the Template Generator.');
      } catch (error) {
        console.error('Error saving template:', error);
        alert('Failed to save template. Please try again.');
      }
    }
  };

  return (
    <motion.div 
      className="invoice-preview"
      initial={{ opacity: 0, x: 100, rotateY: 10 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ 
        type: "spring",
        duration: 1,
        bounce: 0.3,
        delay: 0.3
      }}
    >
      <motion.h2
        className="preview-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {isSOW ? 'Statement of Work Preview' : 'Invoice Preview'}
      </motion.h2>
      <motion.div 
        className="preview-content"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: 0.7,
          type: "spring",
          bounce: 0.4
        }}
      >
        <Editor
          apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue={initialContent}
          onEditorChange={handleEditorChange}
          init={{
            height: 800,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | image | help',
            content_style: 'body { font-family:Arial,sans-serif; font-size:14px }',
            inline: true,
            fixed_toolbar_container: '#toolbar',
            images_upload_handler: async (blobInfo) => {
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blobInfo.blob());
              });
            }
          }}
        />
      </motion.div>
      <div className="preview-actions">
        <motion.button 
          type="button"
          className="preview-button"
          onClick={handleDownload}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Download Document
        </motion.button>
        <motion.button 
          type="button"
          className="preview-button template-button"
          onClick={handleSaveAsTemplate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Save as Template
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InvoicePreview; 