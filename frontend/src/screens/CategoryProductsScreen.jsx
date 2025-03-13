import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";

const CategoryProductsScreen = () => {
    const { category } = useParams();
    const decodedCategory = decodeURIComponent(category); // Fix encoding issues for Greek categories
    const { data, isLoading, error } = useGetProductsQuery({ category: decodedCategory });

    return (
        <Container>
            <h1 className="text-center my-4">{decodedCategory}</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.message || error.error}</Message>
            ) : (
                <Row>
                    {data.products.length > 0 ? (
                        data.products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))
                    ) : (
                        <Message variant="info">No products found for this category.</Message>
                    )}
                </Row>
            )}
        </Container>
    );
};

export default CategoryProductsScreen;
