import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Mobile Filter Toggle State
  const [showFilters, setShowFilters] = useState(false);

  // URL Params
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';

  // Filter States
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest'); 
  
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [page, search, categoryParam, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = `/api/products?page=${page}&limit=9&search=${search}&category=${categoryParam}&sort=${sort}`;
      if (minPrice) query += `&minPrice=${minPrice}`;
      if (maxPrice) query += `&maxPrice=${maxPrice}`;

      const res = await axios.get(query);
      if (res.data && res.data.data) {
        setProducts(res.data.data);
        setTotalPages(res.data.meta ? res.data.meta.totalPages : 1);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPrice = () => {
    setPage(1);
    fetchProducts();
    setShowFilters(false); // Close mobile sidebar on apply
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSearch('');
    setPage(1);
    setTimeout(fetchProducts, 100); 
    setShowFilters(false);
  };

  return (
    <div className="main-layout">
      
      {/* --- MOBILE FILTER OVERLAY --- */}
      {showFilters && <div className="sidebar-overlay" onClick={() => setShowFilters(false)}></div>}

      {/* --- SIDEBAR (Responsive) --- */}
      <aside className={`sidebar ${showFilters ? 'mobile-open' : ''}`}>
        
        {/* Mobile Header Inside Sidebar */}
        <div className="sidebar-header-mobile">
            <h3>Filters</h3>
            <button className="close-sidebar-btn" onClick={() => setShowFilters(false)}>&times;</button>
        </div>

        <div className="filter-section">
          <h4>Search</h4>
          <input 
            type="text" 
            placeholder="Keyword..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            style={{width: '100%', padding: '8px', boxSizing:'border-box'}}
          />
        </div>

        <div className="filter-section">
          <h4>Price Range (₹)</h4>
          <div className="price-inputs">
            <input 
              type="number" 
              placeholder="Min" 
              value={minPrice} 
              onChange={(e) => setMinPrice(e.target.value)} 
            />
            <span>-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)} 
            />
          </div>
          <button className="btn-apply" onClick={handleApplyPrice}>Go</button>
        </div>

        <div className="filter-section">
          <h4>Sort By</h4>
          <label className="sort-option">
            <input 
              type="radio" 
              name="sort" 
              value="newest" 
              checked={sort === 'newest'} 
              onChange={(e) => setSort(e.target.value)} 
            /> Newest Arrivals
          </label>
          <label className="sort-option">
            <input 
              type="radio" 
              name="sort" 
              value="price_low" 
              checked={sort === 'price_low'} 
              onChange={(e) => setSort(e.target.value)} 
            /> Price: Low to High
          </label>
          <label className="sort-option">
            <input 
              type="radio" 
              name="sort" 
              value="price_high" 
              checked={sort === 'price_high'} 
              onChange={(e) => setSort(e.target.value)} 
            /> Price: High to Low
          </label>
        </div>

        <button 
            onClick={handleClearFilters}
            className="clear-filter-btn"
        >
            Clear All Filters
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="content-area">
        
        {/* Mobile Toggle Button */}
        <div className="mobile-filter-bar">
            <h2 style={{margin:0, fontSize: '1.2rem'}}>
                {categoryParam ? categoryParam : 'All Products'}
            </h2>
            <button className="filter-toggle-btn" onClick={() => setShowFilters(true)}>
                Wait... Filter ☰
            </button>
        </div>

        {/* Desktop Header */}
        <h2 className="desktop-header" style={{marginTop: '0', fontSize: '1.5rem'}}>
          {categoryParam ? categoryParam : 'All Products'}
        </h2>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {products.map(prod => (
                <Link to={`/product/${prod.id}`} key={prod.id} className="product-card">
                  <img src={prod.image_url} alt={prod.name} />
                  <div className="card-body">
                    <div className="card-category">{prod.category}</div>
                    <h3>{prod.name}</h3>
                    <div className="card-price">₹{prod.price}</div>
                  </div>
                </Link>
              ))}
            </div>

            {products.length === 0 && (
                <div className="no-results">
                    <h3>No products found.</h3>
                    <p>Try adjusting your filters.</p>
                </div>
            )}

            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;