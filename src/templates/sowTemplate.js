export const sowTemplate = {
  render: (data, calculateTotal) => {
    const total = calculateTotal();
    const formattedTotal = total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    return `
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      ${data.logo ? `
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${data.logo}" alt="Company Logo" style="max-width: 200px; height: auto;">
        </div>
      ` : ''}

      <h1 style="text-align: center; color: #333;">Statement of Work</h1>
      
      <div style="margin: 20px 0;">
        <p><strong>SOW Number:</strong> ${data.invoiceNumber}</p>
        <p><strong>Start Date:</strong> ${data.date}</p>
        <p><strong>End Date:</strong> ${data.dueDate}</p>
        <p><strong>Client:</strong> ${data.clientName}</p>
        <p><strong>Client Email:</strong> ${data.clientEmail}</p>
      </div>

      <div style="margin: 30px 0;">
        <h2>Project Scope</h2>
        <p>${data.projectScope || 'Project scope to be defined.'}</p>
      </div>

      <div style="margin: 30px 0;">
        <h2>Deliverables and Pricing</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 12px; border-bottom: 2px solid #ddd; text-align: left;">Description</th>
              <th style="padding: 12px; border-bottom: 2px solid #ddd; text-align: right;">Hours</th>
              <th style="padding: 12px; border-bottom: 2px solid #ddd; text-align: right;">Rate</th>
              <th style="padding: 12px; border-bottom: 2px solid #ddd; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${item.description}</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price}</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 12px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 12px; text-align: right;"><strong>${formattedTotal}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="margin: 30px 0;">
        <h2>Terms and Conditions</h2>
        <p>${data.terms || 'Terms and conditions to be defined.'}</p>
      </div>

      ${data.signature ? `
        <div style="margin-top: 40px;">
          <h2>Authorization</h2>
          <div style="margin-top: 20px;">
            <div style="display: inline-block; margin-right: 50px;">
              <img src="${data.signature}" alt="Signature" style="max-width: 200px; height: auto;">
              <hr style="width: 200px; margin: 10px 0;">
              <p>Authorized Signature</p>
            </div>
            <div style="display: inline-block;">
              <p style="margin-bottom: 30px;">Date: ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ` : ''}
    </div>`;
  }
}; 