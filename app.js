import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import users from './routes/users.js'; 
import funds from './routes/funds.js';
import portfolios from './routes/portfolios.js';
import dotenv from 'dotenv';
import db from './models/index.js'; // Import the entire db object
import cronJob from './jobs/scheduledJobs.js';  // Import the cron job

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; 

// Function to start the server after database connection
const startServer = async () => {
    try {
        await db.sequelize.authenticate();
        console.log(' Database connected');

        app.listen(PORT, () => {
            console.log(` Server is listening on port ${PORT}`);
        });

    } catch (err) {
        console.error(' Database connection error:', err);
    }
};

// Call the async function to start the server
startServer();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Route handlers
app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
});
app.use('/api/users', users);
app.use('/api/funds', funds);
app.use('/api/portfolio', portfolios);

// Export the app instance for testing
export default app;
