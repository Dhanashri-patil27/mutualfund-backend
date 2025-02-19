import express from 'express';
import fundsController from '../controller/fundsController.js';
import authenticateToken from '../middleware/authMiddleware.js';
import { validation } from '../middleware/Validator.js'; // Corrected import
import { asyncErrorHandler } from '../middleware/ErrorHandler.js'; // Corrected import
import { validateScheme } from '../middleware/validations.js'; // Corrected import

const router = express.Router();

router.get('/families', authenticateToken, fundsController.fetchFundFamilies);
router.get('/schemes', authenticateToken, validateScheme(), validation, asyncErrorHandler(fundsController.fetchSchemesByFamily));

export default router;
