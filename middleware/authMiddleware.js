import jwt from 'jsonwebtoken';
import ErrorCodes from '../errors/ErrorCodes.js';

const authenticateToken = (req, res, next) => {
    const secretKey = process.env.JWT_SECRET;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.trim();

    if (!token) {
        const errorCode = { ...ErrorCodes['100003'] };
        return res.status(errorCode.statusCode).json({
            message: errorCode.message || "Internal Server Error",
            code: errorCode.responseCode || "300003",
            type: errorCode.type || "ServerError",
        });
    }

    jwt.verify(token, secretKey, (err, decodedToken) => {
        if (err) {
            const errorCode = { ...ErrorCodes['100003'] };
            return res.status(errorCode.statusCode || 500).json({
                message: errorCode.message || "Internal Server Error",
                code: errorCode.responseCode || "300003",
                type: errorCode.type || "ServerError",
            });
        }
        req.user = decodedToken;
        next();
    });
};

export default authenticateToken;
