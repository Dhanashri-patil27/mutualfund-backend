# Mutual Fund Broker Web Application

## Project Overview
This is a backend application for a Mutual Fund Brokerage Firm that allows users to:
- Create an account and log in securely.
- Select a fund family house and fetch open-ended mutual fund schemes.
- View and track their investment portfolio with real-time value updates.
- Integrate with **RapidAPI** to fetch mutual fund NAV (Net Asset Value) data.
- Fetch mutual fund details from **AMFI (Association of Mutual Funds in India)** due to rate limits on RapidAPI.
- Utilize **PostgreSQL-based caching** to optimize API performance and reduce redundant requests.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **External API**: RapidAPI (Latest Mutual Fund NAV API), AMFI
- **Caching**: PostgreSQL-based caching for performance optimization
- **Testing**: Mocha, Supertest
- **Frontend**: Vanilla JS, HTML, CSS

## Folder Structure
```
📦 mutual-fund-broker-app
├── 📂 cacheManager   # PostgreSQL-based caching logic
├── 📂 config         # Configuration files
├── 📂 controller     # Route logic
├── 📂 errors         # Error handling modules
├── 📂 jobs           # Scheduled jobs
├── 📂 middleware     # Authentication and validation middleware
├── 📂 migrations     # Database migration files
├── 📂 models         # Database models
├── 📂 routes         # API endpoints
├── 📂 services       # Business logic
├── 📂 test           # End-to-end tests
├── 📜 .env.example   # Example environment file
├── 📜 .gitignore     # Git ignore file
├── 📜 app.js         # Main application entry point
├── 📜 package.json   # Dependencies and scripts
├── 📜 package-lock.json # Lock file for dependencies
├── 📜 README.md      # Project documentation
```

## Setup Instructions
### Clone the Repository
```sh
git clone https://github.com/Dhanashri-patil27/mutualfund-backend.git
cd mutualfund-backend
```

### Install Dependencies
```sh
npm install
```

### Set Up Environment Variables
Create a `.env` file and add the following variables:
```sh
PORT=3000
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_secret_key
RAPIDAPI_KEY=your_rapidapi_key
```

### Run Database Migrations
```sh
npm run migrate
```

### Start the Server
```sh
npm start
```
The API will be available at `http://localhost:3000`

## API Endpoints
### Authentication
| Method | Endpoint         | Description           |
|--------|----------------|-----------------------|
| POST   | /api/users/signup | User Registration    |
| POST   | /api/users/login  | User Login           |

### Mutual Fund Data
| Method | Endpoint                    | Description                             |
|--------|-----------------------------|-----------------------------------------|
| GET    | /api/funds/families         | Fetch available fund family houses     |
| GET    | /api/funds/schemes?family=XYZ | Fetch open-ended schemes from RapidAPI or AMFI if rate limits are reached |

### Portfolio Management
| Method | Endpoint          | Description                    |
|--------|------------------|--------------------------------|
| POST   | /api/portfolio/add | Add new investment            |
| GET    | /api/portfolio/?userId=XYZ   | View user investments         |
| GET    | /api/portfolio/value?userId=XYZ | View portfolio value         |

## Running Tests
Run the test suite using:
```sh
npm test
```

## Postman Collection
Import the following Postman collection to test the API:
[Postman Collection](https://documenter.getpostman.com/view/15719725/2sAYdZvaCD)

The frontend repository is available here:
**[Frontend Repository](https://github.com/Dhanashri-patil27/mutualfund-frontend.git)**
