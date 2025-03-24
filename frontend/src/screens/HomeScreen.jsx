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
import { Carousel } from 'react-bootstrap';



const groupLogosSmart = (logos, perSlide) => {
  const groups = [];

  for (let i = 0; i < logos.length; i += perSlide) {
    const group = logos.slice(i, i + perSlide);

    if (group.length < perSlide && groups.length > 0) {
      // fill the last group using previous ones
      const needed = perSlide - group.length;
      const fromPrev = groups[groups.length - 1].slice(-needed);
      groups.push([...fromPrev, ...group]);
    } else {
      groups.push(group);
    }
  }

  return groups;
  
};





const categories = ['All', 'Αντλίες Σκαφών', 'Υποβρύχιος Φωτισμός', 'Όργανα Ελέγχου', 'Υαλοκαθαριστήρες Σκαφών', 'Συστήματα Πλοήγησης', 'Alternator Regulator', 'Όργανα Ελέγχου και Αυτοματισμού',
  'Έξυπνο Σύστημα Πρόληψης Συγκρούσεων', 'Συστήματα Ελέγχου', 'Ηλεκτρολογικό Υλικό Σκαφών', 'Ηλεκτρικός Εξοπλισμός', 'Φορτιστές Μπαταριών', 'Συστήματα Αυτοματισμού', 'Marine Generator'
];

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const navigate = useNavigate();
  const [perSlide, setPerSlide] = useState(3); // ✅ Moved inside component

  useEffect(() => {
    const updatePerSlide = () => {
      setPerSlide(window.innerWidth < 576 ? 2 : 3); // ✅ Responsive setup
    };

    updatePerSlide();
    window.addEventListener('resize', updatePerSlide);
    return () => window.removeEventListener('resize', updatePerSlide);
  }, []);

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
  <>
    <Container className="text-center my-4">
  <img
    src="/images/first_extracted_image.jpg"
    alt="Banner"
    className=" hero-banner"
  />
</Container>


    <Container
      fluid
      className="py-5 px-3 my-4 text-center"
      style={{
        backgroundColor: '#4a66a3',
        color: '#fff',
        borderRadius: '12px'
      }}
    >
      <h2 className="mb-3" style={{ fontWeight: 700 }}>
        ⚡️ Powering Yachts Across the Ionian – Fast, Expert, Unmatched
      </h2>
      <p
        style={{
          fontSize: '1.1rem',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.8'
        }}
      >
        <strong>Electrical Marine Services (EMS)</strong>, based in Corfu, has been a trusted force in marine electrics for over 15 years.
        We deliver high-performance electrical installations, precision upgrades, and on-demand emergency support for yachts and pleasure boats across Greece and Albania.
        <br /><br />
        Whether you're docked in port or adrift at sea, EMS brings expert service to your vessel — anywhere in the Ionian, within 2 hours.
        Count on us to keep your journey safe, smooth, and powered with absolute confidence.
      </p>
    </Container>
  </>
) : (
  <Link to="/" className="btn btn-light mb-4">Go Back</Link>
)}

<Container className="my-5">
  <h3 className="text-center mb-4" style={{ color: '#283C79', fontWeight: 'bold' }}>
    Our Trusted Partners
  </h3>

  <Carousel indicators={false} controls={true} interval={3000} pause={false}>
  {groupLogosSmart([
    { src: "/images/victron-energy-b-v-seeklogo.png", alt: 'Victron Energy' },
    { src: '/images/yanmar-seeklogo.png', alt: 'Yanmar Engine' },
    { src: '/images/zeus-logo.png', alt: 'Zeus' },
    { src: '/images/logo_feit_white.png', alt: 'Feit Electric' },
  ], perSlide).map((group, slideIndex) => (
    <Carousel.Item key={slideIndex}>
      <div className="d-flex justify-content-center gap-4 align-items-center" style={{ height: '180px' }}>
        {group.map((partner, index) => {
          const isWhiteTextLogo = partner.alt === 'Feit Electric';
          return (
            <div
              key={index}
              style={{
                width: '140px',
                height: '100px',
                backgroundColor: isWhiteTextLogo ? '#1a1a1a' : 'white',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img
                src={partner.src}
                alt={partner.alt}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          );
        })}
      </div>
    </Carousel.Item>
  ))}
</Carousel>
</Container>









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


          <Container className="my-5">
  <h3 className="text-center mb-4" style={{ color: '#283C79', fontWeight: 'bold' }}>
    Electrical Marine Services – Corfu Location
  </h3>

  <Row className="align-items-center">
    <Col md={7} className="mb-4 mb-md-0">
      <div className="d-flex justify-content-center">
        <iframe
          title="EMS Corfu Location"
          src="https://www.google.com/maps?q=39.645001742961725,19.851914724030458&z=18&output=embed"
          width="100%"
          height="450"
          style={{
            border: 0,
            borderRadius: '12px',
            width: '100%',
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </Col>

    <Col md={5}>
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h5 style={{ color: '#283C79', fontWeight: 'bold' }}>Contact Info</h5>
        <p className="mb-1"><strong>Address:</strong> Gouvia Marina, Corfu, Greece</p>
        <p className="mb-1"><strong>Phone:</strong> <a href="tel:+302661401219" style={{ color: '#283C79' }}>+30 2661401219</a></p>
        <p className="mb-1"><strong>Email:</strong> <a href="mailto:info@ionianems.com" style={{ color: '#283C79' }}>info@ionianems.com</a></p>
        <p className="mb-0"><strong>Hours:</strong> Mon–Sat: 9:00–18:00</p>
      </div>
    </Col>
  </Row>
</Container>

        </>
      )}
    </>
  );
};





export default HomeScreen;
