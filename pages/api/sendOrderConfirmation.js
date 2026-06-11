import postmark from 'postmark';
import nodemailer from 'nodemailer';

const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { to, subject, body } = req.body;

    try {
      await client.sendEmail({
        From: 'info@lbweb.eu',
        To: to,
        Subject: subject,
        HtmlBody: body,
      });

      res.status(200).json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: 'Error sending email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
