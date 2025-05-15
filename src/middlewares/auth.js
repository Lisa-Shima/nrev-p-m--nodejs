const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async(req, res, next) => {
    const header = req.headers.authorization
    if(!header || !header.startsWith('Bearer ')) return res.status(400).json({message: 'No token provided'})

    const token = header.split(' ')
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findByPk(decoded.userId)
        if(!user) return res.status(400).json('User no longer exists')

        req.user = user
        next()
    }
    catch(err){
        return res.status(400).json({ message: 'Invalid token'})
    }
}

exports.adminOnly = async(req, res, next) => {
    if(req.role !== 'ROLE_ADMIN'){
        return res.status(400).json({message: 'Admins only'})
    }
    next()
}