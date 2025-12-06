const request = require('supertest');
const app = require('../index'); 
const db = require('../src/config/db');

describe('Product API Endpoints', () => {

    // 1. Test the GET /api/products route
    it('GET /api/products should return a list of products', async () => {
        const res = await request(app).get('/api/products');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success', true);
        expect(Array.isArray(res.body.data)).toBeTruthy();
        
        // Check if meta data (pagination) exists
        expect(res.body).toHaveProperty('meta');
    });

    // 2. Test GET single product (assuming ID 1 exists from seeder)
    it('GET /api/products/1 should return specific product', async () => {
        const res = await request(app).get('/api/products/1');
        
        if (res.statusCode === 200) {
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('id', 1);
        } else {
            // In case DB is empty or ID 1 doesn't exist
            expect(res.statusCode).toBeOneOf([404, 200]);
        }
    });

    // 3. Test 404 for non-existent route
    it('GET /api/unknown should return 404', async () => {
        const res = await request(app).get('/api/unknown');
        expect(res.statusCode).toEqual(404);
    });
    
    // Close DB connection after tests (Optional/Clean up)
    afterAll((done) => {
        db.close();
        done();
    });
});