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

  // ✅ Define backend URL properly
  const backendURL = process.env.REACT_APP_API_URL || "https://ionianems-backend.onrender.com";

  useEffect(() => {
    const verifyEmail = async () => {
      console.log("📢 Verifying Email - Sending Request to:", `${backendURL}/api/users/verify/${token}`);
      try {
        const { data } = await axios.get(`${backendURL}/api/users/verify/${token}`);
        console.log("✅ API Response:", data);

        if (data?.message === 'User already verified. Please log in.') {
          navigate('/login?verified=true'); // ✅ Redirect immediately
        } else {
          setMessage(data.message);
          setTimeout(() => {
            navigate('/login?verified=true');
          }, 3000);
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Invalid or expired token';
        console.error("🚨 Email Verification Error:", errorMsg);

        if (errorMsg.includes('expired') || errorMsg.includes('Invalid token')) {
          navigate('/login?verified=false');
        } else {
          setError(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate, backendURL]); // ✅ Ensure backendURL is a dependency

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
