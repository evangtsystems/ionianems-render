import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminBulkUploadScreen = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories'); // ✅ Get categories from backend
        setCategories(data);
      } catch (error) {
        toast.error("Error fetching categories.");
      }
    };
    fetchCategories();
  }, []);

  

  const uploadHandler = async (e) => {
    e.preventDefault();
  
    if (!selectedCategory || !selectedFiles) {
      toast.error("Please select a category and images to upload.");
      return;
    }
  
    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append('images', file);
    });
  
    try {
      setUploading(true);
      setUploadProgress(0);
  
      const { data } = await axios.post(`/api/upload/bulk-upload/${encodeURIComponent(selectedCategory)}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
  
      toast.success("✅ Images uploaded successfully!");
      console.log("Uploaded Images:", data.images);
  
      // 🔥 Update state so that images can be displayed immediately
      setUploadedImages(data.images);
      setSelectedFiles(null);
      setUploadProgress(100);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Bulk Upload Images</h2>
          <Form onSubmit={uploadHandler}>
            <Form.Group>
              <Form.Label>Select Category</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Select Images</Form.Label>
              <Form.Control type="file" multiple onChange={(e) => setSelectedFiles(e.target.files)} />
            </Form.Group>

            {uploading && <ProgressBar animated now={uploadProgress} label={`${uploadProgress}%`} className="mt-3" />}

            <Button type="submit" className="mt-3 w-100" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Images'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminBulkUploadScreen;
