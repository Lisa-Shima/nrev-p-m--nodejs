const Owner = require('../models/Owner')
const { validationResult } = require('express-validator')
const { Op } = require('sequelize')
const PlateNumber = require('../models/PlateNumber')

exports.createOwner = async(req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array()})

    const { names, email, phone, nationalId, address } = req.body
    try{
        const owners = await Owner.findAll()
        // const existing = await Owner.findOne({ where: { [Op.or]: [ {email: email}, {phone: phone}, {nationalId: nationalId}]}})
        const existing = owners.find(owner => 
            owner.email === email ||
            owner.phone === phone ||
            owner.nationalId === nationalId
        )
        if(existing) return res.status(401).json({ message: 'Owner already exists'})

        const owner = await Owner.create({ names, email, phone, nationalId, address})
        res.status(201).json({ message: 'Owner created successfully'})
    }
    catch(err){
        console.error("DB ERROR:", err);
        next(err)
    }
}

exports.getAllOwners = async(req, res, next) => {
    try{
        const { page = 1, size = 10, nationalId, email, phone } = req.query
        const where = {}
        if(nationalId) where.nationalId = nationalId;
        if(email) where.email = email
        if(phone) where.phone = phone

        const limit = parseInt(10)
        const offset = (page - 1) * limit
        const { count, rows } = await Owner.findAndCountAll({ where, limit, offset})

        res.status(200).json({ total: count, page: parseInt(page), size: limit, owners: rows})
    }
    catch(err){
        next(err)
    }
}

exports.createPlateNumber = async(req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) return res.status(401).json({errors: errors.array()})
    try{
        const {ownerId} = req.params
        const owner = await Owner.findByPk(ownerId)
        if(!owner) return res.status(400).json({ message: 'Owner does not exist'})

        const { number, issuedDate } = req.body
        const exists = await PlateNumber.findOne({where: {number}})
        if(exists) return res.status(400).json({message: 'Plate Number already exists'})

        const plateNumber = await PlateNumber.create({ number, issuedDate, ownerId})
        res.status(200).json({message: 'Plate Number registered successfully', plateNumber})
    }
    catch(err){
        next(err)
    }
}

exports.getPlateNumberByOwner = async(req, res, next) => {
    try{
        const { ownerId } = req.params
        const owner = await Owner.findOne({ where: {id: ownerId}})
        if(!owner) return res.status(400).json({message: 'Owner does not exist'})

        const platenumbers = await PlateNumber.findAll({where: {ownerId}})
        res.status(200).json(platenumbers)
    }
    catch(err){
        next(err)
    }
}