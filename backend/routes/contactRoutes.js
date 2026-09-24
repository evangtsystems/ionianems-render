import express from 'express';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();
const allowedHostnames = new Set(['ionianems.com', 'www.ionianems.com']);

router.post('/', async (req, res) => {
  const { name, email, message, turnstileToken } = req.body || {};

  if (
    typeof name !== 'string' || !name.trim() || name.length > 120 ||
    typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
    typeof message !== 'string' || !message.trim() || message.length > 5000
  ) {
    return res.status(400).json({ error: 'Please provide a valid name, email and message.' });
  }

  if (typeof turnstileToken !== 'string' || !turnstileToken || turnstileToken.length > 2048) {
    return res.status(400).json({ error: 'Please complete the verification challenge.' });
  }

  if (!process.env.TURNSTILE_SECRET_KEY) {
    console.error('Contact form: TURNSTILE_SECRET_KEY is not configured');
    return res.status(503).json({ error: 'Contact form is temporarily unavailable.' });
  }

  try {
    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!verificationResponse.ok) {
      throw new Error(`Turnstile verification returned ${verificationResponse.status}`);
    }

    const verification = await verificationResponse.json();
    const validHostname = allowedHostnames.has(verification.hostname) ||
      (process.env.NODE_ENV !== 'production' && verification.hostname === 'localhost');

    if (!verification.success || !validHostname) {
      return res.status(403).json({ error: 'Verification failed. Please try again.' });
    }

    await sendEmail({
      email: process.env.CONTACT_RECEIVER_EMAIL,
      subject: `New Contact Message from ${name.trim()}`,
      message: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(503).json({ error: 'Unable to send your message. Please try again.' });
  }
});

export default router;
