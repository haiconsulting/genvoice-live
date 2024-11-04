import { defaultTemplate } from './defaultTemplate';
import { sowTemplate } from './sowTemplate';

class TemplateManager {
  constructor() {
    this.templates = new Map([
      ['default', defaultTemplate],
      ['sow', sowTemplate]
    ]);
  }

  getTemplate(name) {
    // If we have a custom template stored, return it
    if (this.templates.has(name)) {
      return this.templates.get(name);
    }
    
    // If it's a SOW template (either built-in or custom), return SOW template
    if (name === 'sow' || (name && name.includes('-sow-'))) {
      return this.templates.get('sow');
    }
    
    // Default fallback
    return this.templates.get('default');
  }

  async addTemplate(name, templateFile, config) {
    try {
      const fileContent = await this.readTemplateFile(templateFile);
      const template = {
        name,
        type: config.type,
        render: (invoiceData, calculateTotal) => {
          let content = fileContent;
          
          // Replace standard fields
          Object.entries(invoiceData).forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
              content = content.replace(
                new RegExp(`{{${key}}}`, 'g'),
                value || ''
              );
            }
          });

          // Handle items array for custom templates
          if (content.includes('{{#each items}}')) {
            const itemsHtml = invoiceData.items.map(item => {
              let itemTemplate = content.split('{{#each items}}')[1].split('{{/each}}')[0];
              Object.entries(item).forEach(([key, value]) => {
                itemTemplate = itemTemplate.replace(
                  new RegExp(`{{${key}}}`, 'g'),
                  key === 'price' || key === 'total' ? 
                    Number(value).toFixed(2) : 
                    value
                );
              });
              // Calculate and replace total for each item
              itemTemplate = itemTemplate.replace(
                new RegExp(`{{total}}`, 'g'),
                (item.quantity * item.price).toFixed(2)
              );
              return itemTemplate;
            }).join('');
            
            content = content.replace(
              /{{#each items}}.*{{\/each}}/s,
              itemsHtml
            );
          }

          // Replace calculated values
          content = content.replace(
            new RegExp(`{{totalAmount}}`, 'g'),
            calculateTotal().toFixed(2)
          );

          // Replace SOW-specific calculations
          if (config.type === 'sow') {
            const totalHours = invoiceData.items.reduce(
              (sum, item) => sum + Number(item.quantity), 
              0
            );
            content = content.replace(
              new RegExp(`{{totalHours}}`, 'g'),
              totalHours.toString()
            );
          }

          return content;
        }
      };

      // Store the template
      this.templates.set(name, template);
      return true;
    } catch (error) {
      console.error('Error adding template:', error);
      return false;
    }
  }

  async readTemplateFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }
}

export const templateManager = new TemplateManager();