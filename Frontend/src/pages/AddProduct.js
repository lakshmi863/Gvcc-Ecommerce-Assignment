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
    // FIX 1: Now using this state in the form below
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

            // 2. Prepare Data (simulated create)
            const productData = { name, price, category, description, imageUrl };
            
            console.log("Image Saved at:", imageUrl);
            console.log("Product Data:", productData);

            alert(`Image Uploaded Successfully! check console for data.`);
            
            // FIX 2: Redirect user to home page after success
            navigate('/'); 

        } catch (error) {
            console.error(error);
            alert('Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container">
            <div style={{maxWidth: '600px', margin: '20px auto', background: 'var(--bg-card)', padding: '20px', borderRadius: '8px', color: 'var(--text-main)', border: '1px solid var(--border-color)'}}>
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
                            {/* Updated with all categories from your Navbar */}
                            <option value="Electronics">Electronics</option>
                            <option value="Audio">Audio</option>
                            <option value="TV & Home Entertainment">TV & Home</option>
                            <option value="Mobiles">Mobiles</option>
                            <option value="Laptops & Accessories">Laptops</option>
                            <option value="Smart Technologies">Smart Tech</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Kids">Kids Fashion</option>
                            <option value="Men">Men's Fashion</option>
                            <option value="Women">Women's Fashion</option>
                            <option value="Bags & Luggage">Bags & Luggage</option>
                            <option value="Sportswear">Sportswear</option>
                            <option value="Books">Books</option>
                        </select>
                    </div>

                    {/* FIX 3: Added Description Input */}
                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            required 
                            style={{width: '100%', height: '80px', padding: '10px'}}
                        />
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