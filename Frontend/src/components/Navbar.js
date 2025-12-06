import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return 'dark'; 
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const navData = {
    Electronics: [
      { label: "Audio", value: "Audio" },
      { label: "TV & Home Entertainment", value: "TV_Home_Entertainment" },
      { label: "Mobiles", value: "Mobiles" },
      { label: "Laptops & Accessories", value: "Laptops_Accessories" },
      { label: "Smart Technologies", value: "Smart_Technologies" }
    ],
    Fashion: [
      { label: "Kids", value: "Kids" },
      { label: "Men", value: "Men" },
      { label: "Women", value: "Women" },
      { label: "Bags & Luggage", value: "Bags_Luggage" },
      { label: "Sportswear", value: "Sportswear" }
    ],
    Books: []
  };
  const handleMainClick = (category) => {
    setActiveTab(category);
    navigate(`/?category=${category}`);
  };

  const handleSubClick = (subCategoryValue) => {
    navigate(`/?category=${subCategoryValue}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="nav-container">
      <nav className="navbar main-navbar">
        
        {/* 1. BRAND LOGO */}
        <Link to="/" className="nav-brand" onClick={() => setActiveTab(null)}>
            <img src="/Gvcc.png" alt="Logo" className="nav-logo" />
            <span className="brand-text">GVCC Solutions</span>
        </Link>

        {/* 2. NAVIGATION LINKS */}
        <div className="nav-links">
            {Object.keys(navData).map((cat) => (
                <button 
                key={cat} 
                className={`nav-item ${activeTab === cat ? 'active' : ''}`}
                onClick={() => handleMainClick(cat)}
                >
                {cat}
                </button>
            ))}
            
            <Link 
              to="/add-product" 
              className="nav-item" 
              style={{textDecoration: 'none', display: 'inline-flex', alignItems: 'center'}}
            >
              Add Product
            </Link>
        </div>

        {/* 3. AUTH & THEME BUTTONS (Added class 'nav-auth') */}
        <div className="nav-auth">
            {user ? (
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            ) : (
                <Link to="/login" className="login-link">
                    Login
                </Link>
            )}

            <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
                {theme === 'dark' ? '☀️' : '🌙'}
            </button>
        </div>

      </nav>

      {/* SUB NAVBAR */}
      {activeTab && navData[activeTab].length > 0 && (
        <div className="sub-navbar">
          {navData[activeTab].map((sub) => (
            <button 
              key={sub.value} 
              className="sub-nav-item"
              onClick={() => handleSubClick(sub.value)}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;