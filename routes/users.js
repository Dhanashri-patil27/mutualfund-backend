import express from 'express';
import UserController from '../controller/userController.js';
import { validation } from '../middleware/Validator.js'; // Corrected import
import { asyncErrorHandler } from '../middleware/ErrorHandler.js'; // Corrected import
import { loginRules, signUpRules } from '../middleware/validations.js'; // Corrected import

const router = express.Router();

router.post('/signup', signUpRules(), validation, asyncErrorHandler( UserController.signup));
router.post('/login', loginRules(), validation, asyncErrorHandler( UserController.login));

export default router;
