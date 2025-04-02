import express from 'express';
import sendEmail from '../utils/sendEmail.js'; // Make sure this exists and works

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await sendEmail({
      email: process.env.CONTACT_RECEIVER_EMAIL, // where messages go
      subject: `New Contact Message from ${name}`,
      message: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('🚨 Contact form error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

export default router;
