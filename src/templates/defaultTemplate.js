export const defaultTemplate = {
  name: 'Default Template',
  render: (invoiceData, calculateTotal) => `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #000000;">
      ${invoiceData.logo ? `
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${invoiceData.logo}" alt="Company Logo" style="max-width: 200px; max-height: 100px; object-fit: contain;">
        </div>
      ` : ''}
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <h2 style="color: #000000; margin: 0;">Invoice #${invoiceData.invoiceNumber}</h2>
        <div>
          <p style="margin: 5px 0; color: #000000;">Date: ${invoiceData.date}</p>
          <p style="margin: 5px 0; color: #000000;">Due Date: ${invoiceData.dueDate}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3 style="color: #000000; margin-bottom: 10px;">Bill To:</h3>
        <p style="margin: 5px 0; color: #000000;">${invoiceData.clientName}</p>
        <p style="margin: 5px 0; color: #000000;">${invoiceData.clientEmail}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; color: #000000;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #000000; color: #000000;">Description</th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #000000; color: #000000;">Quantity</th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #000000; color: #000000;">Price</th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #000000; color: #000000;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData.items.map(item => `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #000000;">${item.description}</td>
              <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #000000;">${item.quantity}</td>
              <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #000000;">$${item.price.toFixed(2)}</td>
              <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #000000;">$${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; color: #000000;">Total:</td>
            <td style="padding: 12px; font-weight: bold; color: #000000;">$${calculateTotal().toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      ${invoiceData.signature ? `
        <div style="margin-top: 40px;">
          <img src="${invoiceData.signature}" alt="Signature" style="max-height: 60px; object-fit: contain;">
          <p style="margin: 5px 0; color: #000000;">Authorized Signature</p>
        </div>
      ` : ''}
    </div>
  `
}; 