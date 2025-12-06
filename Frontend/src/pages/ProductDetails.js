import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EnquiryModal from '../components/EnquiryModal';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Loading details...</div>;
  if (!product) return <div className="loading">Product not found.</div>;

  return (
    <div className="container">
      <div className="detail-container">
        <div className="detail-image">
          <img src={product.image_url} alt={product.name} />
        </div>
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="detail-price">₹{product.price}</p>
          <h3>Description</h3>
          <p className="detail-desc">{product.long_desc || product.short_desc}</p>
          
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            Enquire Now
          </button>
        </div>
      </div>

      {showModal && (
        <EnquiryModal 
          productId={product.id} 
          productName={product.name} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default ProductDetails;