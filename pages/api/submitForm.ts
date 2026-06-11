import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Escape HTML to prevent XSS attacks
function escapeHtml(text: string | undefined | null): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Support both contact form and quote form
  const {
    name,
    phoneNumber,
    phone, // from quote form
    subject,
    message,
    clientEmail,
    email, // from quote form
    businessName,
    selectedPlan,
    planName,
    service,
  } = req.body;

  // Determine form type and validate accordingly
  const isQuoteForm = !!service || !!selectedPlan;
  const emailField = clientEmail || email;
  const phoneField = phoneNumber || phone;

  // Basic validation - at minimum we need name and email
  if (!name || !emailField) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Contact form requires: name, phoneNumber, subject, message, clientEmail
  // Quote form requires: name, email (at minimum)
  if (!isQuoteForm && (!phoneField || !subject || !message)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate email configuration
  if (!process.env.ZOHO_SMTP_SERVER || !process.env.NEXT_PUBLIC_EMAIL_USERNAME || !process.env.MAIL_PASS) {
    return res.status(500).json({ message: 'Email service configuration error' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_SERVER,
      port: Number(process.env.ZOHO_SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USERNAME,
        pass: process.env.MAIL_PASS,
      },
    });

    // Generate email content based on form type
    let emailSubject: string;
    let emailHtml: string;

    if (isQuoteForm) {
      emailSubject = `New Quote Request - ${escapeHtml(service || 'Google Business Profile Ranking')}`;
      emailHtml = `
        <h2>Quote Request Form</h2>
        <p><strong>Service:</strong> ${escapeHtml(service || 'Google Business Profile Ranking')}</p>
        ${selectedPlan ? `<p><strong>Selected Plan:</strong> ${escapeHtml(planName || selectedPlan)}</p>` : ''}
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(emailField)}</p>
        ${phoneField ? `<p><strong>Phone:</strong> ${escapeHtml(phoneField)}</p>` : ''}
        ${businessName ? `<p><strong>Business Name:</strong> ${escapeHtml(businessName)}</p>` : ''}
        ${message ? `<p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>` : ''}
      `;
    } else {
      emailSubject = `New Contact Form Submission - ${escapeHtml(subject)}`;
      emailHtml = `
        <h2>Contact Form Message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(emailField)}</p>
        <p><strong>Phone Number:</strong> ${escapeHtml(phoneField)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
      `;
    }

    const mailOptions = {
      from: `Paula Pango <${process.env.NEXT_PUBLIC_EMAIL_USERNAME}>`,
      to: process.env.NEXT_PUBLIC_EMAIL_USERNAME,
      replyTo: emailField,
      subject: emailSubject,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Form submitted successfully!' });
  } catch {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
