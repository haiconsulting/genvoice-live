import React from 'react';
import './InvoiceItems.css';

const InvoiceItems = ({ items, setInvoiceData, invoiceData }) => {
  const isSOW = 
    invoiceData.selectedTemplate === 'sow' || 
    (invoiceData.selectedTemplate && invoiceData.selectedTemplate.includes('-sow-'));

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setInvoiceData({
      ...invoiceData,
      items: newItems
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceData({
      ...invoiceData,
      items: newItems
    });
  };

  return (
    <div className="invoice-items">
      <h3>{isSOW ? 'SOW Items' : 'Invoice Items'}</h3>
      {items.map((item, index) => (
        <div key={index} className="invoice-item">
          <input
            type="text"
            placeholder={isSOW ? "Task Description" : "Description"}
            value={item.description}
            onChange={(e) => updateItem(index, 'description', e.target.value)}
          />
          <input
            type="number"
            placeholder={isSOW ? "Hours" : "Quantity"}
            value={item.quantity}
            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
          />
          <input
            type="number"
            placeholder={isSOW ? "Rate/Hour" : "Price"}
            value={item.price}
            onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
          />
          <button type="button" onClick={() => removeItem(index)} className="remove-item">
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={addItem} className="add-item">
        Add {isSOW ? 'Task' : 'Item'}
      </button>
    </div>
  );
};

export default InvoiceItems; 