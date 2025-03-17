import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Rating from './Rating';

const Product = ({ product }) => {
  const { userInfo } = useSelector((state) => state.auth); // Get logged-in user info

  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={product.image} // ✅ Cloudinary URL (no need to modify it)
          alt={product.name}
          variant='top'
          onError={(e) => e.target.src = "/images/placeholder.webp"} // ✅ Fallback if image fails
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </Card.Text>

        {userInfo ? (
          <Card.Text as='h3'>${product.price}</Card.Text>
        ) : (
          <Link to='/register'>
            <Card.Text as='h5' style={{ color: 'blue' }}>
              Register to see price
            </Card.Text>
          </Link>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
