import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
  const { t } = useTranslation();

  const aboutUsText = t('about_us_description', {
    defaultValue: `For over 15 years, EMS Electrical Marine Services has been dedicated to delivering expert marine electrical solutions for both pleasure boats and professional yachts. Based in Corfu, we specialize in electrical installations, system reconstructions, and certifications in accordance with Greek and international classification societies.

Our experienced team offers:

• New electrical installations tailored to each vessel
• Complete system overhauls for boats of all types
• Onboard and workshop repairs of electrical machinery
• A wide selection of in-stock spare parts from top domestic and global suppliers

We proudly provide immediate support across Greece, with service also available in Albania upon consultation. Our mobile response team is equipped to reach you within 2 hours anywhere in the Ionian Sea.

At EMS, we stay ahead of industry developments, ensuring that every solution is modern, efficient, and built to last. Our mission is to combine technical excellence, reliability, and personalized support — keeping your vessel powered, safe, and ready for the sea.`
  });

  return (
    <Container className="mt-5">
      <Row className="text-center">
        <Col>
          <h1>{t('About Us')}</h1>
          <p className="lead" style={{ whiteSpace: 'pre-line' }}>
            {aboutUsText}
          </p>
          <div className="mt-4">
            <Button as={Link} to="/" variant="primary">
              {t('back_to_home')}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
