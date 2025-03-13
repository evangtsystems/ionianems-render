import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product && product.name) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      }).unwrap();
      toast.success('✅ Product updated successfully!');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      console.log('📌 Image Upload Response:', res);

      if (res.filePath) {
        setImage(res.filePath);
        toast.success('✅ Image uploaded successfully!');
      } else {
        toast.error('⚠️ Image path missing from response');
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.error('🚨 Upload Error:', err);
    }
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error?.data?.message || error.error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            {/* Name Field */}
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            {/* Price Field */}
            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            {/* Image Upload */}
            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image URL'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Form.Control type='file' onChange={uploadFileHandler} />
              {loadingUpload && <Loader />}
            </Form.Group>

            {/* Brand Field */}
            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>

            {/* Count in Stock */}
            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter count in stock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>

            {/* ✅ Fixed Category Dropdown */}
            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as='select'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=''>Select Category</option>
                <option value='Αντλίες Σκαφών'>Αντλίες Σκαφών</option>
                <option value='Υποβρύχιος Φωτισμός'>Υποβρύχιος Φωτισμός</option>
                <option value='Όργανα Ελέγχου'>Όργανα Ελέγχου </option>
                <option value='Υαλοκαθαριστήρες Σκαφών'>Υαλοκαθαριστήρες Σκαφών</option>
                <option value='Συστήματα Πλοήγησησ'> Συστήματα Πλοήγησης</option>
                <option value='Ρυθμιστής Εναλλάκτη'>Ρυθμιστής Εναλλάκτη</option>
                <option value='Όργανα Αυτοματισμού'>Όργανα Αυτοματισμού</option>
                <option value='Έξυπνο Σύστημα Πρόληψης Συγκρούσεων'>Έξυπνο Σύστημα Πρόληψης Συγκρούσεων</option>
                <option value='Συστήματα Ελέγχου'>Συστήματα Ελέγχου </option>
                <option value='Ηλεκτρολογικό Υλικό Σκαφών'>Ηλεκτρολογικό Υλικό Σκαφών</option>
                <option value='Ηλεκτρικός Εξοπλισμός'> Ηλεκτρικός Εξοπλισμός</option>
                <option value='Φορτιστές Μπαταριών'>Φορτιστές Μπαταριών</option>
                <option value='Συστήματα Αυτοματισμού'>Συστήματα Αυτοματισμού</option>
                <option value='Γεννήτρια Θαλάσσης'>Γεννήτρια Θαλάσσης</option>


                
              </Form.Control>
            </Form.Group>

            {/* Description Field */}
            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            {/* Submit Button */}
            <Button type='submit' variant='primary' style={{ marginTop: '1rem' }}>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
