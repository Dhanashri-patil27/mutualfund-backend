import request from 'supertest';
import app from '../app.js'; 
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../models/index.js'; 

dotenv.config();

// Mock user and token generation
const testUser = {
    name: 'dhanashri',
    email: 'dhanashripati2067@gmail.com',
    password: 'Password@123'
};
const validToken = jwt.sign({email: testUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
const invalidToken = 'invalid.token.here';

// Sample investment data
const testInvestment = {
    schemeCode: '12345',
    schemeName: 'HDFC Equity Fund',
    units: 10,
    purchasePrice: 100
};

describe('User Routes', function () {

    describe('POST /api/users/signup', function () {
        it('should successfully signup a user', async function () {
            const response = await request(app)
                .post('/api/users/signup')
                .send(testUser);
                 testInvestment.userId = response.body.id

            
            expect(response.statusCode).to.equal(200);
        });

        it('should return error if user already exists', async function () {
            const response = await request(app)
                .post('/api/users/signup')
                .send(testUser);
            
            
            expect(response.statusCode).to.equal(422);
            expect(response.body).to.have.property('message', 'Email already exists.');
        });
    });

    describe('POST /api/users/login', function () {
        it('should successfully login and return a token', async function () {
            const response = await request(app)
                .post('/api/users/login')
                .send({ email: testUser.email, password: testUser.password });
            
            
            expect(response.statusCode).to.equal(200);
        });

        it('should return error for invalid credentials', async function () {
            const response = await request(app)
                .post('/api/users/login')
                .send({ email: testUser.email, password: 'WrongPassword' });
            
            
            expect(response.statusCode).to.equal(400);
            expect(response.body).to.have.property('message');
        });

        it('should return error if user does not exist', async function () {
            const response = await request(app)
                .post('/api/users/login')
                .send({ email: 'nonexistent@example.com', password: 'Password@123' });
            
            expect(response.statusCode).to.equal(422);
            expect(response.body).to.have.property('message', 'User not exists.');
        });
    });
});

describe('Funds Routes', function () {
    describe('GET /api/funds/families', function () {
        it('should return fund families when authenticated', async function () {
            const response = await request(app)
                .get('/api/funds/families')
                .set('Authorization', `${validToken}`);
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('should return error if no token is provided', async function () {
            const response = await request(app)
                .get('/api/funds/families');

            expect(response.statusCode).to.equal(401);
            expect(response.body).to.have.property('message')
        });

        it('should return error if token is invalid', async function () {
            const response = await request(app)
                .get('/api/funds/families')
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(response.statusCode).to.equal(401);
            expect(response.body).to.have.property('message');
        });
    });

    describe('GET /api/funds/schemes', function () {
        it('should return schemes when provided with a valid family name', async function () {
            const response = await request(app)
                .get('/api/funds/schemes')
                .query({ family: 'HDFC Mutual Funds' })
                .set('Authorization', `${validToken}`);

            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('should return error if family name is missing', async function () {
            const response = await request(app)
                .get('/api/funds/schemes')
                .set('Authorization', `${validToken}`);

            expect(response.statusCode).to.equal(400);
            expect(response.body).to.have.property('message');
        });

        it('should return error if token is invalid', async function () {
            const response = await request(app)
                .get('/api/funds/schemes')
                .query({ family: 'HDFC Mutual Funds' })
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(response.statusCode).to.equal(401);
            expect(response.body).to.have.property('message');
        });
    });
});

describe('Portfolio Routes', function () {
    describe('POST /api/portfolio/add', function () {
        it('should add an investment successfully', async function () {
            const response = await request(app)
                .post('/api/portfolio/add')
                .set('Authorization', `${validToken}`)
                .send(testInvestment);
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.have.property('totalValue');
        });

        it('should return error if no token is provided', async function () {
            const response = await request(app)
                .post('/api/portfolio/add')
                .send(testInvestment);
            
            expect(response.statusCode).to.equal(401);
            expect(response.body).to.have.property('message');
        });

        it('should return error if token is invalid', async function () {
            const response = await request(app)
                .post('/api/portfolio/add')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send(testInvestment);
            
            expect(response.statusCode).to.equal(401);
            expect(response.body).to.have.property('message');
        });

        it('should return error for invalid inputs', async function () {
            const response = await request(app)
                .post('/api/portfolio/add')
                .set('Authorization', `${validToken}`)
                .send();
            
            expect(response.statusCode).to.equal(400);
            expect(response.body).to.have.property('message');
        });
    });

    describe('GET /api/portfolio', function () {
        it('should fetch user portfolio successfully', async function () {
            const response = await request(app)
                .get('/api/portfolio/')
                .query({ userId: testInvestment.userId })
                .set('Authorization', `${validToken}`);
            
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.an('array');
        });
        it('should return error for invalid inputs', async function () {
            const response = await request(app)
                .get('/api/portfolio/')
                .query()
                .set('Authorization', `${validToken}`);
            
            expect(response.statusCode).to.equal(400);
            expect(response.body).to.have.property('message');
        });
        it('should return error if user does not exist', async function () {
            const response = await request(app)
                .get('/api/portfolio/')
                .query({ userId: '5027691c-7b80-42d4-9699-ca14a847bcb1' })
                .set('Authorization', `${validToken}`);
            expect(response.statusCode).to.equal(422);
            expect(response.body).to.have.property('message');
        });
    });

    describe('GET /api/portfolio/value', function () {
        it('should return portfolio value successfully', async function () {
            const response = await request(app)
                .get('/api/portfolio/value')
                .query({ userId: testInvestment.userId })
                .set('Authorization', `${validToken}`);
            
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.have.property('totalValue');
        });
        it('should return error for invalid inputs', async function () {
            const response = await request(app)
                .get('/api/portfolio/value')
                .query()
                .set('Authorization', `${validToken}`);
            
            expect(response.statusCode).to.equal(400);
            expect(response.body).to.have.property('message');
        });
        it('should return error if user does not exist', async function () {
            const response = await request(app)
                .get('/api/portfolio/value')
                .query({ userId: '5027691c-7b80-42d4-9699-ca14a847bcb1' })
                .set('Authorization', `${validToken}`);
            
            expect(response.statusCode).to.equal(422);
            expect(response.body).to.have.property('message');
        });
    });
});
// Cleanup after tests
after(async function () {
    console.log("🚀 Cleaning up test database...");
    try {
        await db.sequelize.query( `DELETE FROM "portfolios" WHERE "userId" = $1`, {
            bind: [testInvestment.userId],
            type: db.Sequelize.QueryTypes.DELETE
        });
        console.log("Test portfolio deleted successfully.");
        await db.sequelize.query(`DELETE FROM "users" WHERE email = $1`, {
            bind: [testUser.email],
            type: db.Sequelize.QueryTypes.DELETE
        });
        console.log("Test user deleted successfully.");
    } catch (error) {
        console.error("Error deleting test data:", error);
    }
});