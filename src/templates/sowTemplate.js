export const sowTemplate = {
  name: 'Statement of Work Template',
  render: (invoiceData, calculateTotal) => `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #000000;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <h2 style="color: #000000; margin: 0;">Statement of Work #${invoiceData.invoiceNumber}</h2>
        <div>
          <p style="margin: 5px 0; color: #000000;">Start Date: ${invoiceData.date}</p>
          <p style="margin: 5px 0; color: #000000;">End Date: ${invoiceData.dueDate}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3 style="color: #000000; margin-bottom: 10px;">Client Information:</h3>
        <p style="margin: 5px 0; color: #000000;">Client: ${invoiceData.clientName}</p>
        <p style="margin: 5px 0; color: #000000;">Email: ${invoiceData.clientEmail}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #000000; margin-bottom: 10px;">Project Scope:</h3>
        <p style="margin: 5px 0; color: #000000;">${invoiceData.projectScope || 'Not specified'}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; color: #000000;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #000000; color: #000000;">Task Description</th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #000000; color: #000000;">Hours</th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #000000; color: #000000;">Rate/Hour</th>
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
            <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; color: #000000;">Total Hours: ${invoiceData.items.reduce((sum, item) => sum + Number(item.quantity), 0)}</td>
            <td style="padding: 12px; font-weight: bold; color: #000000;"></td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; color: #000000;">Total Amount:</td>
            <td style="padding: 12px; font-weight: bold; color: #000000;">$${calculateTotal().toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px;">
        <h3 style="color: #000000; margin-bottom: 10px;">Terms and Conditions:</h3>
        <p style="margin: 5px 0; color: #000000;">${invoiceData.terms || 'Standard terms and conditions apply.'}</p>
      </div>
    </div>
  `
}; 