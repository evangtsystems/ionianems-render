import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';  // ✅ Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';

const OurWork = () => {
  const { t } = useTranslation();
  const { userInfo } = useSelector((state) => state.auth);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const backendURL = process.env.REACT_APP_API_URL || "https://ionianems-backend.onrender.com"; // ✅ Fallback URL
        const { data } = await axios.get(`${backendURL}/api/upload/our-work/images`);
        setImages(data);
      } catch (error) {
        console.error('🚨 Error fetching Our Work images:', error);
        toast.error('🚨 Error fetching Our Work images!');
      }
    };
    fetchImages();
  }, []);
  

  // Upload "Our Work" images to backend
  const handleImageUpload = async (event) => {
    if (!userInfo || !userInfo.isAdmin) return;
  
    const file = event.target.files[0];
    if (!file) {
      toast.error('🚨 No file selected!');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', file);
  
    // ✅ Debugging: Log FormData contents
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  
    try {
      console.log('Uploading image:', file.name);
  
      const { data } = await axios.post('https://ionianems-backend.onrender.com/api/upload/our-work', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      console.log('✅ Image uploaded:', data.filePath);
      setImages((prevImages) => [...prevImages, data.filePath]);
  
      toast.success('✅ Image uploaded successfully!');
    } catch (error) {
      console.error('🚨 Upload failed:', error.response ? error.response.data : error.message);
      toast.error(`🚨 Upload failed: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };
  
  
  return (
    <Container className="mt-5 text-center">
      <ToastContainer />  {/* ✅ Add ToastContainer here */}

      <h1 className="mb-4 text-uppercase" style={{ fontWeight: 'bold', letterSpacing: '2px' }}>{t('our_work')}</h1>
      <p className="lead mb-4 text-muted">{t('our_work_description', { defaultValue: "Here are some examples of our marine electrical engineering work." })}</p>
      
      {userInfo && userInfo.isAdmin && (
        <Form.Group controlId="imageUpload" className="mb-4">
          <Form.Label className="fw-bold">{t('upload_photos')}</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
        </Form.Group>
      )}

      <Row className="mt-4 d-flex justify-content-center">
        {images.length > 0 && images.map((img, index) => (
          <Col key={index} xs={12} md={6} className="mb-4"> {/* 2 images per row */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" }}
              className="shadow-lg rounded overflow-hidden position-relative"
              style={{ borderRadius: '20px', overflow: 'hidden' }}
            >
              <img 
  src={img} 
  alt={`Uploaded ${index}`} 
  className="img-fluid rounded" 
  style={{ width: '800px', height: '600px', objectFit: 'cover', borderRadius: '20px' }}
/>

            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default OurWork;
