import express from 'express';
import PortfolioController from '../controller/portfolioController.js';
import authenticateToken  from '../middleware/authMiddleware.js'
import { validation } from '../middleware/Validator.js'; // Corrected import
import { asyncErrorHandler } from '../middleware/ErrorHandler.js'; // Corrected import
import { validateUser, addPortfolio } from '../middleware/validations.js'; // Corrected import

const router = express.Router();

router.post('/add', authenticateToken, addPortfolio(), validation, asyncErrorHandler( PortfolioController.addInvestment));
router.get('/', authenticateToken, validateUser(), validation, asyncErrorHandler(PortfolioController.fetchUserPortfolio));
router.get('/value', authenticateToken, validateUser(), validation, asyncErrorHandler(PortfolioController.fetchPortfolioValue));

export default router;
