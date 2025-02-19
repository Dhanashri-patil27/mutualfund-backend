import dotenv from 'dotenv';

dotenv.config();

const configObj = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres"
    }
};

// Export using ESM syntax
export default configObj;
