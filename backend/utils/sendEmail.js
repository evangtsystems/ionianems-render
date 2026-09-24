const sendEmail = async ({ email, subject, message }) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: process.env.EMAIL_FROM_NAME || 'IonianEMS',
          email: process.env.EMAIL_FROM_EMAIL,
        },
        to: [
          {
            email,
          },
        ],
        subject,
        textContent: message,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('🚨 Brevo Email Error:', response.status, data);
      throw new Error('Brevo email failed');
    }

    console.log('✅ Email Sent via Brevo:', data.messageId || 'OK');
  } catch (error) {
    console.error('🚨 Email Sending Error:', error.message);
    throw new Error('Failed to send email.');
  }
};

export default sendEmail;
