const express = require('express')
const { body, query } = require('express-validator')
const { registerVehicle, getVehicles } = require('../controllers/vehicleController')
const { protect, adminOnly } = require('../middlewares/auth')

const router = express.Router()
router.use(protect, adminOnly)

router.post('/', [
    body('chassisNumber').notEmpty(),
    body('manufactureCompany').notEmpty(),
    body('manufactureYear').isInt({ min: 1886}).notEmpty(),
    body('price').isDecimal(),
    body('modelName').notEmpty(),
    body('ownerId').isUUID(),
    body('plateNumberId').isUUID()
], registerVehicle)

router.get('/', [
    query('page').optional().isInt({min: 1}),
    query('size').optional().isInt({min: 1}),
    query('chassisNumber').optional(),
    query('ownerId').optional().isUUID(),
    query('plateNumberId').optional().isUUID()
], getVehicles)

module.exports = router