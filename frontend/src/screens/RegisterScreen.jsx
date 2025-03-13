import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import validator from 'validator'; // Email validation
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';

import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useRegisterMutation } from '../slices/usersApiSlice';
import Message from '../components/Message'; // Ensure this component is imported

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const [register, { isLoading }] = useRegisterMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!validator.isEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');

    if (recaptchaRef.current) {
      recaptchaRef.current.execute();
    } else {
      toast.error('reCAPTCHA not loaded');
    }
  };

  const onRecaptchaVerify = async (token) => {
    setCaptchaToken(token);
    console.log('reCAPTCHA Token:', token);

    try {
      // Call the registration API with the reCAPTCHA token
      await register({ name, email, password, captchaToken: token }).unwrap()

      toast.success('Registration successful! Please check your email to verify your account.');
      setIsRegistered(true);

      navigate(`/check-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Register</h1>

      {isRegistered ? (
        <Message variant='info'>
          Registration successful! Please check your email and verify your account before logging in.
        </Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className='my-2' controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='my-2' controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <Form.Group className='my-2' controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='my-2' controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          {/* ✅ Invisible reCAPTCHA (Runs only on form submit) */}
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LcHFdcqAAAAALip27tck5ULKhZifnMwfRbdRvG9" // Replace with your actual Site Key
            size="invisible"
            onChange={onRecaptchaVerify} // Trigger after execution
          />

          <Button disabled={isLoading} type='submit' variant='primary'>
            Register
          </Button>

          {isLoading && <Loader />}
        </Form>
      )}

      <Row className='py-3'>
        <Col>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;