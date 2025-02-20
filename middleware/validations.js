import { body, query } from 'express-validator';

export const validateScheme = () => [
  query('family', 'family is missing or invalid').exists().isString().not().isEmpty(),
];


export const validateUser = () => [
  query('userId', 'userId is missing or invalid').exists().isUUID().not().isEmpty(),
];

export const loginRules = () => [
  body('email', 'Email is missing or invalid value')
    .exists()
    .isEmail()
    .not()
    .isEmpty(),
  body('password', 'Password key is missing').exists(),
  body('password', 'Please enter a password at least 8 characters and contain at least one uppercase, one lowercase, and one special character.')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    }),
];


export const signUpRules = () => [
  body('name', 'name missing or Invalid Value').exists().isString().not().isEmpty().matches(/^[a-zA-Z ]+$/),
  body('email', 'email missing or Invalid Value').exists().isEmail().not().isEmpty(),
  body('password', ' password key is missing').exists(),   
  body('password', 'Please enter a password at least 8 characters and contain at least one uppercase, one lowercase, and one special character.')
      .isStrongPassword({
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          returnScore: false,
          pointsPerUnique: 1,
          pointsPerRepeat: 0.5,
          pointsForContainingLower: 10,
          pointsForContainingUpper: 10,
          pointsForContainingNumber: 10,
          pointsForContainingSymbol: 10,
      }),
];

export const addPortfolio = () => [
  body('userId', 'userId is missing or invalid').exists().isUUID().not().isEmpty(),
  body('schemeCode', 'schemeCode is missing or invalid').exists().isString().not().isEmpty(),
  body('schemeName', 'schemeName is missing or invalid').exists().isString().not().isEmpty(),
  body('units', 'units is missing or invalid').exists().isNumeric().not().isEmpty(),
  body('purchasePrice', 'purchasePrice is missing or invalid').exists().isNumeric().not().isEmpty(),
];
