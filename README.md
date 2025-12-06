A full-stack e-commerce style application built for the **GVCC Solutions** assignment. Users can browse products, filter by categories, view details, and submit enquiries. The application features a React frontend, a Node.js/Express backend, and persistent data storage using SQLite.

Backend url:( https://gvcc-ecommerce-backend.onrender.com )
Frontend url ( https://gvcc-ecommerce-front.onrender.com )

NavBar Section: 

<img width="1918" height="341" alt="image" src="https://github.com/user-attachments/assets/13f95c5d-4092-4bdd-8d15-5ee5d9678f17" />


Home Page
<img width="1907" height="1036" alt="image" src="https://github.com/user-attachments/assets/c1feab99-abc6-4532-8fb7-7c6b54f0034d" />

Description:

<img width="1907" height="975" alt="image" src="https://github.com/user-attachments/assets/d28bfdeb-69cf-4133-91b1-8f97f235eca9" />

Enquire:

<img width="677" height="722" alt="image" src="https://github.com/user-attachments/assets/f313dc7c-e260-4eff-a4ba-882ac7e4a463" />

Add Product:

<img width="1918" height="973" alt="image" src="https://github.com/user-attachments/assets/e15e614b-c091-4508-a7af-201c39ff2c1b" />


1) Features

Frontend (React)

Dynamic Navigation: Two-level navigation bar handling main categories (Electronics, Fashion, Books) and sub-categories dynamically.

Product Listing: Grid view with server-side pagination (limit & offset).
Search & Filter: Real-time search and category filtering via URL query parameters.
Product Details: Dedicated page for product descriptions and specifications.
Enquiry Modal: User-friendly form to submit enquiries directly for a specific product.
Responsive Design: Optimized for different screen sizes.

Backend (Node.js & Express)

RESTful API: modular endpoints for Products and Enquiries.
MVC Architecture: Clean separation of concerns (Models, Views/Routes, Controllers).
SQLite Database: Zero-configuration, file-based SQL database (`gvcc.db`).
Data Seeding: Custom script (`setupDb.js`) to populate the database with 50+ sample products and initial data.
Validations: Server-side validation for email formats and required fields.

2) Tech Stack

Frontend:
React.js (v18)
React Router DOM (v6)
Axios (API Requests)
CSS3 (Custom Grid & Flexbox)

Backend:
Node.js environment
Express.js Framework
SQLite3 (Database Driver)
Body-Parser & CORS

3) Project Structure
gvcc-project/

├── backend/

│   ├── src/
│   │   ├── config/      
│   │   ├── controllers/ 
│   │   ├── models/      
│   │   └── routes/      
│   ├── .env             
│   ├── index.js         
│   ├── setupDb.js      
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── logo.png     
    ├── src/
    │   ├── components/  
    │   ├── pages/      
    │   ├── App.js       
    │   └── App.css      
    └── package.json  


4) Installation & Setup
    Clone the Repository
5) Backend Setup
  cd backend
Install dependencies:
npm install
Configure Environment: Create a .env file in the backend/ root:
PORT=5001

Seed the Database (Important): Run the setup script to create tables and insert sample data.

node setupDb.js


6) Frontend Setup

Install dependencies:
  npm install
7) Check Proxy: Ensure package.json has the correct proxy matching the backend port:
  "proxy": "http://localhost:5001"
8) Start the React App:
    npm start


sample data  API Response Structure

{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "JBL Tune Buds",
      "category": "Audio",
      "short_desc": "Pure Bass Sound TWS earbuds...",
      "long_desc": "Product Overview – JBL Tune Buds...",
      "price": 5499,
      "image_url": "https://example.com/image.jpg",
      "created_at": "2023-10-27 10:00:00"
    },
    {
      "id": 2,
      "name": "Sony WH-CH520",
      "category": "Audio",
      "short_desc": "Lightweight on-ear Bluetooth...",
      "long_desc": "Product Description – Sony On-Ear...",
      "price": 4490,
      "image_url": "https://example.com/image2.jpg",
      "created_at": "2023-10-27 10:05:00"
    }
  ],
  "meta": {
    "total": 59,
    "page": 1,
    "limit": 10,
    "totalPages": 6
  }
}


9) Design Decisions & Trade-offs
 
SQLite Database:
Decision: Chosen for simplicity as requested. It requires no external server installation (like MySQL/PostgreSQL), making the project easy to review.
Trade-off: Not suitable for high-concurrency production environments compared to PostgreSQL.
No User Authentication:
Decision: The requirements focused on product display and enquiry submission. Authentication was omitted to keep the scope focused on core CRUD and UI logic.
Future Improvement: JWT Authentication could be added for an Admin Dashboard.
Server-Side Pagination:
Decision: Pagination logic is handled in the SQL query (OFFSET, LIMIT) rather than the frontend to improve performance if the dataset grows large.   

10) Troubleshooting
Issue: API returns data: [] (Empty list)
Solution: The database file might be empty or located in the wrong path. Stop the backend, verify backend/src/config/gvcc.db exists, runs node setupDb.js, and restart the server.
Issue: Frontend shows "404 Not Found"
Solution: The Frontend proxy isn't working. Ensure the backend is running on Port 5001 and restart the Frontend (npm start) so it reads the proxy setting in package.json.



      
    

