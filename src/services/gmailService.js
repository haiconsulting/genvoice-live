import axios from 'axios';

export class GmailService {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  async sendEmail(to, subject, body) {
    try {
      // Create email in base64 format
      const email = [
        `From: me`,
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        body
      ].join('\r\n');

      const encodedEmail = Buffer.from(email).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send email using Gmail REST API
      const response = await axios.post(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          raw: encodedEmail
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
} 