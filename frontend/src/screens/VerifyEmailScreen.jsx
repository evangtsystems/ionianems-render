import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import Message from '../components/Message';
import axios from 'axios';

const VerifyEmailScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const backendURL = process.env.REACT_APP_API_URL || "https://ionianems-backend.onrender.com";
        const { data } = await axios.get(`${backendURL}/api/users/verify/${token}`);
        

        if (data.message === 'User already verified. Please log in.') {
          // ✅ Skip showing the message and redirect immediately
          navigate('/login?verified=true');
        } else {
          setMessage(data.message);
          setTimeout(() => {
            navigate('/login?verified=true');
          }, 3000);
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Invalid or expired token';

        if (errorMsg.includes('expired') || errorMsg.includes('Invalid token')) {
          // ✅ Skip showing the error and just redirect
          navigate('/login?verified=false');
        } else {
          setError(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <Container className="text-center">
      <h1>Email Verification</h1>
      {loading ? (
        <Message variant="info">Verifying your email...</Message>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Message variant="success">{message}</Message>
      )}
      <Button onClick={() => navigate('/login')} variant="primary">
        Go to Login
      </Button>
    </Container>
  );
};

export default VerifyEmailScreen;
