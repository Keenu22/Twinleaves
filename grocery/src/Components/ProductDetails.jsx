import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ProductDetails = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (!productId) {
          setError('Product ID is missing');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/products`);
        const productsData = Array.isArray(response.data.products) ? response.data.products : [];
        const productDetails = productsData.find((product) => product.id === productId);

        if (!productDetails) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        // Transform dates and assign defaults as in Datagrid.jsx
        const mappedProduct = {
          ...productDetails,
          activation_date: productDetails.activation_date
            ? new Date(productDetails.activation_date)
            : null,
          deactivation_date: productDetails.deactivation_date
            ? new Date(productDetails.deactivation_date)
            : null,
        };

        setProduct(mappedProduct);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Product Details</h1>
      {product ? (
        <div
          className="card"
          style={{
            width: '30rem',
            margin: 'auto',
            backgroundColor: '#a78d65', // Set the background color
            borderRadius: '15px', // Round the edges
          }}
        >
          <div
            className="d-flex justify-content-center"
            style={{ padding: '20%' }} // Apply padding: 20% to center the image
          >
            <img
              src="https://www.bing.com/th?id=OIP.7SJp_lSQvrI9ZnUYjNlb-QHaHa&w=150&h=150&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2"
              className="card-img-top"
              alt={product.name}
              style={{
                height: '250px',
                objectFit: 'cover',
                margin: 'auto', // Center image
              }}
            />
          </div>
          <div className="card-body" style={{ padding: '5%' }}> {/* Apply padding: 5% to the card body */}
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">
              <strong>Product ID:</strong> {product.id}
            </p>
            <p className="card-text">
              <strong>Brand:</strong> {product.brand}
            </p>
            <p className="card-text">
              <strong>Description:</strong> {product.description}
            </p>
            <p className="card-text">
              <strong>SKU Code:</strong> {product.sku_code}
            </p>
            <p className="card-text">
              <strong>Main Category:</strong> {product.main_category}
            </p>
            <p className="card-text">
              <strong>Activation Date:</strong>{' '}
              {product.activation_date
                ? product.activation_date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                : 'Invalid Date'}
            </p>
            <p className="card-text">
              <strong>Deactivation Date:</strong>{' '}
              {product.deactivation_date
                ? product.deactivation_date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                : 'Invalid Date'}
            </p>
            <p className="card-text">
              <strong>Price:</strong> ${product.price}
            </p>
            <a href="#" className="btn btn-primary">
              Add to Cart
            </a>
          </div>
        </div>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  );
};

export default ProductDetails;
