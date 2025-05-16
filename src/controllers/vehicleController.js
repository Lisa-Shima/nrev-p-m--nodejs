const { validationResult } = require('express-validator')
const Vehicle = require('../models/Vehicle')
const Owner = require('../models/Owner')
const PlateNumber = require('../models/PlateNumber')

exports.registerVehicle = async(req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()})
    
    try{
        const { chassisNumber, manufactureCompany, manufactureYear, price, modelName, ownerId, plateNumberId } = req.body

        const existing = await Vehicle.findOne({ where: { chassisNumber }})
        if(existing) return res.status(400).json({ message: 'Vehicle already exists' })

        const owner = await Owner.findByPk(ownerId)
        if(!owner) return res.status(400).json({ message: 'Owner does not exist'})

        const plate = await PlateNumber.findByPk(plateNumberId)
        if(!plate) return res.status(400).json({ message: 'Plate does not exist'})

        const vehicle = await Vehicle.create({ chassisNumber, manufactureCompany, manufactureYear, price, modelName, ownerId, plateNumberId})
        plate.status = 'INUSE'
        await plate.save()
        
        const created = await Vehicle.findByPk(vehicle.id, { include: ['owner', 'plate']})
        res.status(200).json(created)
    }
    catch(err){
        next(err)
    }
}

exports.getVehicles = async(req, res, next) => {
    try{
        const { page = 1, size = 10, chassisNumber, ownerId, plateNumberId } = req.query
        const where = {}
        if(chassisNumber) where.chassisNumber = chassisNumber;
        if(ownerId) where.ownerId = ownerId
        if(plateNumberId) where.plateNumberId = plateNumberId

        const limit = parseInt(10)
        const offset = (page - 1) * limit
        const { count, rows } = await Vehicle.findAndCountAll({ where, limit, offset, include: [{ model: Owner, as: 'owner'}, { model: PlateNumber, as: 'plate'}]})

        res.status(200).json({ total: count, page: parseInt(page), size: limit, vehicles: rows})
    }
    catch(err){
        next(err)
    }
}