import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- THEME LOGIC (Default to Dark) ---
  const [theme, setTheme] = useState(() => {
    // 1. Check Local Storage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    // 2. If no save found, Default to DARK automatically
    return 'dark'; 
  });

  // Apply theme to HTML body whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // --- NAVIGATION DATA ---
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
      {/* --- MAIN NAVBAR --- */}
      <nav className="navbar main-navbar">
        {/* Left: Brand Logo */}
        <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
            <Link to="/" className="nav-brand" onClick={() => setActiveTab(null)}>
              <img src="/Gvcc.png" alt="Logo" className="nav-logo" />
              <span className="brand-text">GVCC Solutions</span>
            </Link>
        </div>

        {/* Right: Nav Links + Auth + Theme */}
        <div style={{display:'flex', alignItems:'center'}}>
            
            {/* Category Links */}
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

              {/* ✅ ADDED: Add Product Link (Visible to everyone, or wrap in {user && ...} to hide) */}
              <Link 
                to="/add-product" 
                className="nav-item" 
                style={{textDecoration: 'none', display: 'inline-flex', alignItems: 'center'}}
              >
                Add Product
              </Link>
            </div>

            <div style={{marginLeft: '25px', display: 'flex', gap: '15px', alignItems: 'center', borderLeft: '1px solid #555', paddingLeft: '20px'}}>
                
                {/* Auth Section */}
                {user ? (
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span style={{color: 'var(--accent-color)', fontSize: '0.9rem'}}>Hi, {user.name}</span>
                        <button 
                            onClick={handleLogout} 
                            style={{
                              background:'transparent', 
                              border:'1px solid var(--nav-text)', 
                              color:'var(--nav-text)', 
                              borderRadius:'4px', 
                              cursor:'pointer', 
                              padding:'4px 10px',
                              fontSize: '0.8rem'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link 
                        to="/login" 
                        style={{textDecoration:'none', color:'var(--nav-text)', fontWeight:'600'}}
                    >
                        Login
                    </Link>
                )}

                {/* Theme Toggle Button */}
                <button 
                  className="theme-toggle" 
                  onClick={toggleTheme} 
                  title="Toggle Light/Dark Mode"
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>
        </div>
      </nav>

      {/* --- SUB NAVBAR (Appears when activeTab has children) --- */}
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