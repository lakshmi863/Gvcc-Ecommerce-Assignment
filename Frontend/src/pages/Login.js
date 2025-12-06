import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    // 1. Add loading state
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 2. Start loading and clear previous errors
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post('/api/auth/login', formData);
            login(res.data.token, res.data.user);
            navigate('/');
            // Note: We don't need to set loading to false here because the page redirects
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
            // 3. Stop loading if error occurs so user can try again
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        onChange={handleChange} 
                        required 
                        // Optional: Disable input while loading
                        disabled={isLoading} 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                        required 
                        // Optional: Disable input while loading
                        disabled={isLoading} 
                    />
                    
                    {/* 4. Disable button and change text based on loading state */}
                    <button 
                        type="submit" 
                        className="btn-primary" 
                        style={{width: '100%', opacity: isLoading ? 0.7 : 1}}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p>New here? <Link to="/signup">Create Account</Link></p>
            </div>
        </div>
    );
};

export default Login;