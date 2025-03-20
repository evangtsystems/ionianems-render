import React, { useState } from 'react';
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
import imageHeader from '../assets/resized_header.webp'; // Background image
import logo1 from '../assets/logo1.png'; // Logo (hidden)

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
    <header style={{
      width: '100%',  
      height: '141px',  // ✅ Fixed height for consistency
      display: 'flex',
      alignItems: 'stretch', // ✅ Ensures full height alignment
      backgroundColor: 'white',
      padding: '0',  // ✅ Fix: Added quotes around 0
      margin: '0',  // ✅ Fix: Added quotes around 0
      flexWrap: 'nowrap'  // ✅ Prevents wrapping
}} >

      
      {/* ✅ Left Section - Background Image (Does NOT Shrink) */}
<div className="header-image" style={{
  backgroundImage: `url(${imageHeader})`, // ✅ Corrected template string syntax
  backgroundSize: 'contain', // ✅ Ensures full image visibility without cropping
  backgroundPosition: 'left center', // ✅ Keeps proper alignment
  backgroundRepeat: 'no-repeat',
  flexShrink: 0, // ✅ Prevents the image from shrinking
  height: '140px', // ✅ Keeps height fixed
  width: '500px' // ✅ Ensures it doesn't resize incorrectly
}} />

    
      {/* ✅ Right Section - Navbar (Shrinks Instead of Image) */}
      <div className="navbar-wrapper" style={{
        flexGrow: 1,  // ✅ Expands dynamically
        display: 'flex',
        justifyContent: 'flex-start',
        minWidth: '300px',
      }}>
        <Navbar 
          className="custom-navbar"
          expand="lg" 
          collapseOnSelect
        >
          <Container className="navbar-container">
    
    

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
                  <NavDropdown.Item as={Link} to="/products/Αντλίες Σκαφών">{t('pumps')}</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/products/Υποβρύχιος Φωτισμός">{t('underwater_lighting')}</NavDropdown.Item>
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
                    <NavDropdown.Item as={Link} to="/profile">{t('profile')}</NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>{t('logout')}</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link as={Link} to="/login" style={{ color: '#ffdd57' }}>
                    <FaUser /> {t('sign_in')}
                  </Nav.Link>
                )}

                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title={<span>{t('admin_panel')}</span>} id="adminmenu">
                    <NavDropdown.Item as={Link} to="/admin/productlist">{t('products')}</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/orderlist">{t('orders')}</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/userlist">{t('users')}</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/bulk-upload">{t('bulk_upload')}</NavDropdown.Item>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </header>
  );
};

export default Header;
