import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Electronics');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Redirect if not logged in (Basic protection)
    if (!user) {
        return <div style={{textAlign:'center', marginTop:'50px'}}>Please Login first.</div>;
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = '';

            // 1. Upload Image First
            if (file) {
                const formData = new FormData();
                formData.append('image', file);

                const uploadRes = await axios.post('/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadRes.data.imageUrl;
            }

            // 2. Create Product Entry in Database (Assumes you have a CREATE product route)
            // Note: Since we didn't write a POST /api/products yet, this is hypothetical.
            // If you need the backend code for creating a product, see below.
            
            console.log("Image Saved at:", imageUrl);
            console.log("Product Data:", { name, price, category, description, imageUrl });

            alert(`Image Uploaded Successfully! URL: ${imageUrl}`);
            // navigate('/'); // Redirect after success

        } catch (error) {
            console.error(error);
            alert('Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container">
            <div style={{maxWidth: '600px', margin: '20px auto', background: 'var(--bg-card)', padding: '20px', borderRadius: '8px', color: 'var(--text-main)'}}>
                <h2>Add New Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    
                    <div className="form-group">
                        <label>Price</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option>Electronics</option>
                            <option>Fashion</option>
                            <option>Books</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Image</label>
                        <input type="file" onChange={handleFileChange} accept="image/*" />
                    </div>

                    <button type="submit" className="btn-primary" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Save Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;