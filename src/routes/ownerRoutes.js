const express = require('express')
const { body, query } = require('express-validator')
const { createOwner, createPlateNumber, getAllOwners, getPlateNumberByOwner } = require('../controllers/ownerController')

const router = express.Router()
const { protect, adminOnly } = require('../middlewares/auth')
router.use(protect, adminOnly)

router.post('/', [
    body('names').notEmpty(),
    body('email').isEmail(),
    body('phone').notEmpty(),
    body('nationalId').notEmpty(),
    body('address').notEmpty()
], createOwner)

router.get('/', [
    query('page').optional().isInt({min: 1}),
    query('size').optional().isInt({min: 1}),
    query('nationalId').optional(),
    query('email').optional(),
    query('phone').optional()
], getAllOwners)

router.post('/:ownerId/plates', [
    body('number').notEmpty(),
    body('issuedDate').isISO8601()
], createPlateNumber)

router.get('/:ownerId/plates', getPlateNumberByOwner)

module.exports = router