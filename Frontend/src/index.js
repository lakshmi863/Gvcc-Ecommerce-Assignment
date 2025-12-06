import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios'; // Import Axios
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// --- ADD THIS CONFIGURATION ---
// If we are in production, use the env var. If local, use localhost.
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();