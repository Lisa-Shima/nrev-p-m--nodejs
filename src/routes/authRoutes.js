const express = require('express')
const { body } = require('express-validator')
const { signup, login } = require('../controllers/authController')

const router = express.Router()

router.post('/signup', [
    body('names').notEmpty().withMessage('Names are required'),
    body('email').notEmpty().isEmail().withMessage('Email must be valid'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('nationalId').notEmpty().withMessage('National Id is required'),
    body('password').isLength({min: 6}).withMessage('Password should be atleast 6 characters')
], signup)


router.post('/login', [
    body('email').notEmpty().isEmail().withMessage('Email must be valid'),
    body('password').notEmpty().withMessage('Password is required')
], login)

module.exports = router