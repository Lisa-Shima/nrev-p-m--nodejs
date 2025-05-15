const User = require('../models/User')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.signup = async(req, res, next) => {
    // catching errors
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    // Getting the body
    const { names, email, phone, nationalId, password, role } = req.body

    try{
        // Checking if user already exists
        const existing = await User.findOne({ where: {email}})
        if(existing) return res.status(400).json({message: 'Email already in use'})
    
        // Hashing password
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(password, salt)
    
        // creating user
        let userRole = 'ROLE_STANDARD'
        if(role == 'ROLE_ADMIN') userRole = 'ROLE_ADMIN'
        const user = await User.create({
            names, email, phone, nationalId, password: hashed, role: userRole
        })
    
        // give token
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '4d'})
        return res.status(201).json({message: 'User created successfully', token})
    }
    catch(err){
        next(err)
    }
}

exports.login = async(req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }

    try{
        // request.body
        const {email, password} = req.body

        // checking if user exists
        const user = await User.findOne({ where: {email}})
        if(!user) return res.status(401).json({ message: 'User not found'})

        // comparing passwords
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

        const token = jwt.sign({ userId: user.id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '4d'})
        res.status(200).json(token)
    }catch(err){
        next(err)
    }
}