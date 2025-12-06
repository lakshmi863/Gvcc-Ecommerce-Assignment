import React, { useState } from 'react';
import axios from 'axios';

const EnquiryModal = ({ productId, productName, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    // Simple Regex for Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus({ type: 'error', msg: 'Please enter a valid email.' });
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/enquiries', {
        product_id: productId,
        ...formData
      });
      setStatus({ type: 'success', msg: 'Enquiry submitted successfully! We will contact you soon.' });
      setTimeout(() => onClose(), 2000); // Close modal after success
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.error || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Enquire about {productName}</h2>
        
        {status.msg && <div className={status.type === 'error' ? 'error-msg' : 'success-msg'}>{status.msg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phone (Optional)</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Message *</label>
            <textarea name="message" required value={formData.message} onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Enquiry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;