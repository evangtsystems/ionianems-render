import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <Container className="mt-5">
      <Row className="text-center">
        <Col>
          <h1>{t('About Us')}</h1>
          <p className="lead" style={{ whiteSpace: 'pre-line' }}>
            {t('about_us_description', {
              defaultValue:
                "For over 15 years, EMS Electrical Marine Services has specialized in marine electrical installations in both strong and weak currents. Based in Corfu, we provide high-quality services and immediate support throughout Greece and neighboring countries such as Albania and Croatia (upon consultation).\n\n" +
                "We focus on pleasure boats and professional yachts, offering:\n\n" +
                "• New electrical installations on boats.\n" +
                "• Complete electrical system reconstructions for all vessel types.\n" +
                "• Certifications complying with Greek and international classification societies.\n\n" +
                "Our mission is to deliver quality, reliability, and continuous customer support, ensuring that every client receives tailored solutions for their maritime needs.\n\n" +
                "📍 Location: Kontokali, Marina Gouvia, Kerkyra\n" +
                "📞 Phone: +30 6987795043\n" +
                "✉️ Email: electricalservices@ems.com"
            })}
          </p>
          <div className="mt-4">
            <Button as={Link} to="/" variant="primary">{t('back_to_home')}</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
