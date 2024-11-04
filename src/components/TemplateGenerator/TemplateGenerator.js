import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { openaiService } from '../../services/openaiService';
import { templateManager } from '../../templates/templateManager';
import { defaultTemplate } from '../../templates/defaultTemplate';
import { sowTemplate } from '../../templates/sowTemplate';
import InvoicePreview from '../InvoicePreview/InvoicePreview';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import CostDisplay from '../CostDisplay/CostDisplay';
import './TemplateGenerator.css';

const TemplateGenerator = () => {
  const [templateConfig, setTemplateConfig] = useState({
    baseTemplate: 'default',
    customFields: [],
    aiPrompt: ''
  });

  const [generatedTemplate, setGeneratedTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [generationCosts, setGenerationCosts] = useState(null);

  // Create dummy data object for preview
  const dummyData = {
    invoiceNumber: '{{invoiceNumber}}',
    date: '{{date}}',
    dueDate: '{{dueDate}}',
    clientName: '{{clientName}}',
    clientEmail: '{{clientEmail}}',
    projectScope: '{{projectScope}}',
    terms: '{{terms}}',
    selectedTemplate: templateConfig.baseTemplate,
    items: [
      {
        description: '{{description}}',
        quantity: 0,
        price: 0
      }
    ]
  };

  const getBaseTemplateContent = () => {
    // Create a dummy calculateTotal function that returns a number
    const dummyCalculateTotal = () => 0;

    if (templateConfig.baseTemplate === 'sow') {
      return sowTemplate.render(dummyData, dummyCalculateTotal);
    }
    return defaultTemplate.render(dummyData, dummyCalculateTotal);
  };

  const handleAIPrompt = async () => {
    setIsLoading(true);
    setError(null);
    setLoadingProgress(0);
    setGenerationCosts(null);
    
    try {
      // Start generation process
      setLoadingStatus('Analyzing base template...');
      setLoadingProgress(10);
      const baseTemplate = getBaseTemplateContent();
      
      setLoadingStatus('Getting image suggestions...');
      setLoadingProgress(30);
      const generatedHtml = await openaiService.generateTemplate(
        baseTemplate,
        templateConfig.aiPrompt,
        templateConfig.baseTemplate,
        (status, progress) => {
          setLoadingStatus(status);
          setLoadingProgress(progress);
        }
      );
      
      // Extract costs from HTML comments with updated regex for image query costs
      const costMatch = generatedHtml.match(
        /Generation Cost Information:[\s\S]*?Input Tokens: (\d+)[\s\S]*?Output Tokens: (\d+)[\s\S]*?Image Query Input Tokens: (\d+)[\s\S]*?Image Query Output Tokens: (\d+)[\s\S]*?Input Cost: \$([0-9.]+)[\s\S]*?Output Cost: \$([0-9.]+)[\s\S]*?Image Query Input Cost: \$([0-9.]+)[\s\S]*?Image Query Output Cost: \$([0-9.]+)[\s\S]*?Total Cost: \$([0-9.]+)/
      );
      
      if (costMatch) {
        setGenerationCosts({
          inputTokens: parseInt(costMatch[1]),
          outputTokens: parseInt(costMatch[2]),
          imageQueryInputTokens: parseInt(costMatch[3]),
          imageQueryOutputTokens: parseInt(costMatch[4]),
          inputCost: costMatch[5],
          outputCost: costMatch[6],
          imageQueryInputCost: costMatch[7],
          imageQueryOutputCost: costMatch[8],
          totalCost: costMatch[9]
        });
      }

      setGeneratedTemplate(generatedHtml);

      // Create template name
      const templateName = `ai-${templateConfig.baseTemplate}-${Date.now()}`;
      await templateManager.addTemplate(templateName, new Blob([generatedHtml], { type: 'text/html' }), {
        type: templateConfig.baseTemplate,
        content: generatedHtml
      });

      setLoadingProgress(100);
      setLoadingStatus('Template generated successfully!');
      
      // Show success message
      alert('Template generated successfully! You can now use it in the Document Creator.');
    } catch (err) {
      setError('Failed to generate template. Please try again.');
      console.error('Template generation error:', err);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
      setLoadingProgress(0);
    }
  };

  const handleDownloadTemplate = () => {
    if (!generatedTemplate) return;

    // Create a full HTML document with proper DOCTYPE and meta tags
    const fullHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom ${templateConfig.baseTemplate === 'sow' ? 'SOW' : 'Invoice'} Template</title>
</head>
<body>
${generatedTemplate}
</body>
</html>`;

    // Create blob and download link
    const blob = new Blob([fullHtmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-${templateConfig.baseTemplate}-template-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleTemplateChange = async (newContent) => {
    try {
      // Create a new template from the edited content
      const templateName = `edited-${templateConfig.baseTemplate}-${Date.now()}`;
      await templateManager.addTemplate(templateName, new Blob([newContent], { type: 'text/html' }), {
        type: templateConfig.baseTemplate,
        content: newContent
      });
      
      // Update the generated template state
      setGeneratedTemplate(newContent);
    } catch (err) {
      console.error('Error saving template changes:', err);
      setError('Failed to save template changes. Please try again.');
    }
  };

  return (
    <motion.div 
      className="template-generator"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Template Generator</h2>
      
      {/* Base Template Selection */}
      <div className="template-base-selection">
        <h3>Select Base Template</h3>
        <select
          value={templateConfig.baseTemplate}
          onChange={(e) => setTemplateConfig({
            ...templateConfig,
            baseTemplate: e.target.value
          })}
        >
          <option value="default">Invoice Template</option>
          <option value="sow">Statement of Work Template</option>
        </select>
      </div>

      {/* AI Template Modification */}
      <div className="ai-modification-section">
        <h3>AI Template Customization</h3>
        <p className="field-description">Describe how you'd like to modify the template</p>
        <textarea
          value={templateConfig.aiPrompt}
          onChange={(e) => setTemplateConfig({
            ...templateConfig,
            aiPrompt: e.target.value
          })}
          placeholder="E.g., Make it more formal, add a company logo section, include payment terms..."
          rows={4}
        />
        <button 
          type="button"
          className="generate-button"
          onClick={handleAIPrompt}
          disabled={isLoading || !templateConfig.aiPrompt}
        >
          {isLoading ? 'Generating...' : 'Generate Custom Template'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Template Preview */}
      <div className="template-preview">
        <h3>Template Preview</h3>
        <div className="preview-window">
          {isLoading ? (
            <LoadingIndicator 
              status={loadingStatus} 
              progress={loadingProgress} 
            />
          ) : generatedTemplate ? (
            <>
              <div dangerouslySetInnerHTML={{ __html: generatedTemplate }} />
              {generationCosts && <CostDisplay costs={generationCosts} />}
            </>
          ) : (
            <p>Generate a template to see preview</p>
          )}
        </div>
        {generatedTemplate && (
          <button 
            type="button"
            className="download-button"
            onClick={handleDownloadTemplate}
          >
            Download Template as HTML
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default TemplateGenerator;