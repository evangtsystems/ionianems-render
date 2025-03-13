import { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { resetCart } from '../slices/cartSlice';
import { useTranslation } from 'react-i18next';

import SearchBox from './SearchBox';
import LanguageSwitcher from '../components/LanguageSwitcher';
import logo1 from '../assets/logo1.png';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const [showDropdown, setShowDropdown] = useState(false);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect style={{ color: '#ffffff' }}>

        <Container>
        <Navbar.Brand as={Link} to="/" style={{ color: '#ffffff' }}>

            <img src={logo1} alt="IONIAN EMS" style={{ height: '40px', marginRight: '10px' }} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <SearchBox />
              <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px', transform: 'scale(0.5)' }}>
                <LanguageSwitcher />
              </div>

              {/* ✅ Products Dropdown */}
              <NavDropdown
               title={<span style={{ color: '#ffdd57' }}>{t('products')}</span>}
                id="products-dropdown"
                show={showDropdown}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <NavDropdown.Item as={Link} to="/products/Αντλίες Σκαφών" style={{ color: '#ffdd57' }}>{t('pumps')}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products/Υποβρύχιος Φωτισμός" style={{ color: '#ffdd57' }}>{t('underwater_lighting')}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products/Όργανα Ελέγχου">{t('control_instruments')}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products/Υαλοκαθαριστήρες Σκαφών">{t('boat_wipers')}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products/Συστήματα Πλοήγησης">{t('navigation_systems')}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products/Alternator Regulator">{t('alternator_regulator')}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products/Όργανα Ελέγχου και Αυτοματισμού">{t('control_and_automation')}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products/Έξυπνο Σύστημα Πρόληψης Συγκρούσεων">{t('collision_prevention')}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products/Συστήματα Ελέγχου">{t('control_systems')}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products/Ηλεκτρολογικό Υλικό Σκαφών">{t('marine_electrical')}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products/Ηλεκτρικός Εξοπλισμός">{t('electrical_equipment')}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products/Φορτιστές Μπαταριών">{t('battery_chargers')}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products/Συστήματα Αυτοματισμού">{t('automation_systems')}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products/Marine Generator">{t('marine_generator')}</NavDropdown.Item>
              </NavDropdown>


              <Nav.Link as={Link} to="/our-work" style={{ color: '#ffdd57' }}>{t('Our Work')}</Nav.Link>
              <Nav.Link as={Link} to="/about" style={{ color: '#ffdd57' }}>{t('About Us')}</Nav.Link>
              <Nav.Link as={Link} to="/cart" style={{ color: '#ffdd57' }}>
                <FaShoppingCart /> {t('cart')}
                {cartItems.length > 0 && <Badge pill bg="success" className="ms-1">{cartItems.reduce((a, c) => a + c.qty, 0)}</Badge>}
              </Nav.Link>

              {userInfo ? (
                <NavDropdown title={<span style={{ color: '#ffdd57' }}>{userInfo.name}</span>} id="username">
                <NavDropdown.Item as={Link} to="/profile" style={{ color: '#ffdd57' }}>{t('profile')}</NavDropdown.Item>
                <NavDropdown.Item onClick={logoutHandler} style={{ color: '#ffdd57' }}>{t('logout')}</NavDropdown.Item>
              </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login">
                  <FaUser /> {t('sign_in')}
                </Nav.Link>
              )}

              {userInfo && userInfo.isAdmin && (
               <NavDropdown title={<span style={{ color: '#ffdd57' }}>{t('admin_panel')}</span>} id="adminmenu">
                   <NavDropdown.Item as={Link} to="/admin/productlist" style={{ color: '#ffdd57' }}>{t('products')}</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/orderlist" style={{ color: '#ffdd57' }}>{t('orders')}</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/userlist" style={{ color: '#ffdd57' }}>{t('users')}</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/bulk-upload">{t('bulk_upload')}</NavDropdown.Item>

                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
