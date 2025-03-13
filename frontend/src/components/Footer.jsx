import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#526f7a', padding: '20px 0', color: 'white' }}>
      <Container>
        <Row className="text-center">
          {/* Left Section: Company Info */}
          <Col md={6}>
            <p>IONIANEMS &copy; {currentYear}</p>
            <p>Contact us: <a href="mailto:info@ionianems.com" style={{ color: 'white' }}>info@ionianems.com</a></p>

            {/* Social Media Links */}
            <p>
              Follow us: 
              <a href="https://facebook.com/ionianems" target="_blank" rel="noopener noreferrer" style={{ color: 'white', marginLeft: '10px' }}>
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com/ionianems" target="_blank" rel="noopener noreferrer" style={{ color: 'white', marginLeft: '10px' }}>
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com/ionianems" target="_blank" rel="noopener noreferrer" style={{ color: 'white', marginLeft: '10px' }}>
                <FaInstagram size={20} />
              </a>
              <a href="https://youtube.com/c/ionianems" target="_blank" rel="noopener noreferrer" style={{ color: 'white', marginLeft: '10px' }}>
                <FaYoutube size={20} />
              </a>
              <a href="https://linkedin.com/company/ionianems" target="_blank" rel="noopener noreferrer" style={{ color: 'white', marginLeft: '10px' }}>
                <FaLinkedin size={20} />
              </a>
            </p>
          </Col>

          {/* Right Section: Designed & Hosted + GIF */}
          <Col md={6} className="d-flex justify-content-center align-items-center">
            {/* Designed & Hosted Text with Closer Spacing & Thicker Font */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              fontSize: '18px', // Bigger text
              fontWeight: '400', // Thicker font
              lineHeight: '1', // Reduce space between words
              letterSpacing: '-0.5px', // Make characters closer
              textTransform: 'uppercase',
              marginRight: '5px'
            }}>
              <span>Designed</span>
              <span>& Hosted:</span>
            </div>

            {/* GIF */}
            <img 
              src="https://gtsystems.gr/gtswh.gif" 
              alt="GT Systems GIF" 
              style={{ maxWidth: '35%', height: 'auto' }} 
            />
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
