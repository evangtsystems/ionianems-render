import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import Message from '../components/Message';

const CheckEmailScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  return (
    <Container className="text-center">
      <h1>Email Verification Required</h1>
      <Message variant="info">
        Please check your email <strong>({email})</strong> and click the verification link before logging in.
      </Message>
      <Button onClick={() => navigate('/login')} variant="primary">
        Go to Login
      </Button>
    </Container>
  );
};

export default CheckEmailScreen;
