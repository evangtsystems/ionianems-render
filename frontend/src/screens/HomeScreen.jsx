import { Row, Col, Form, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import { useState, useEffect } from 'react';

const categories = ['All', 'Αντλίες Σκαφών', 'Υποβρύχιος Φωτισμός', 'Όργανα Ελέγχου', 'Υαλοκαθαριστήρες Σκαφών', 'Συστήματα Πλοήγησης', 'Alternator Regulator', 'Όργανα Ελέγχου και Αυτοματισμού',
  'Έξυπνο Σύστημα Πρόληψης Συγκρούσεων', 'Συστήματα Ελέγχου', 'Ηλεκτρολογικό Υλικό Σκαφών', 'Ηλεκτρικός Εξοπλισμός', 'Φορτιστές Μπαταριών', 'Συστήματα Αυτοματισμού', 'Marine Generator'
];

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);
  const categoryFromURL = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setSelectedCategory(categoryFromURL);
  }, [categoryFromURL]);

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category: selectedCategory !== "All" ? selectedCategory : "",
  });

  // ✅ Debugging: Check API call parameters
  console.log("📌 Selected Category:", selectedCategory);
  console.log("🚀 API Call Params:", { keyword, pageNumber, category: selectedCategory });
  console.log("🔍 API Response:", data);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    const queryParams = new URLSearchParams(window.location.search);
    if (category !== "All") {
      queryParams.set("category", category);
    } else {
      queryParams.delete("category");
    }
    navigate(`/?${queryParams.toString()}`, { replace: true });
  };

  return (
    <>
      {/* Category Filter placed at the top */}
      <Container className="my-3">
        <Form.Group controlId="categorySelect" className="mb-3">
          <Form.Label><strong>Filter by Category:</strong></Form.Label>
          <Form.Select 
            value={selectedCategory} 
            onChange={handleCategoryChange} 
            style={{ backgroundColor: '#3ca8b6', color: 'white', fontWeight: 'bold' }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Container>

      {/* Replacing Carousel with an Image */}
      {!keyword ? (
        <Container className="text-center">
          <img 
            src="/images/first_extracted_image.jpg" 
            alt="Banner" 
            className="img-fluid rounded" 
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Container>
      ) : (
        <Link to="/" className="btn btn-light mb-4">Go Back</Link>
      )}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Meta />
          <h1>Latest Products</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate pages={data.pages} page={data.page} keyword={keyword || ''} />
        </>
      )}
    </>
  );
};

export default HomeScreen;
