require('dotenv').config()
const express = require('express')
const sequelize = require('./config/database')
const authRoutes = require('./routes/authRoutes')
const ownerRoutes = require('./routes/ownerRoutes')
const vehicleRoutes = require('./routes/vehicleRoutes')

const app = express()
require('./models/User')
const Owner = require('./models/Owner')
const PlateNumber = require('./models/PlateNumber')
const Vehicle = require('./models/Vehicle')

// associations
Owner.hasMany(PlateNumber, { foreignKey: 'ownerId', as: 'plates'})
PlateNumber.belongsTo(Owner, { foreignKey: 'ownerId', as: 'owner'})
Owner.hasMany(Vehicle, { foreignKey: 'ownerId', as: 'vehicles'})
Vehicle.belongsTo(Owner, { foreignKey: 'ownerId', as: 'owner'})
PlateNumber.hasOne(Vehicle, { foreignKey: 'plateNumberId', as: 'vehicle'})
Vehicle.belongsTo(PlateNumber, { foreignKey: 'plateNumberId', as: 'plate'})

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/owners', ownerRoutes)
app.use('/vehicles', vehicleRoutes)

const PORT = process.env.PORT || 4500
sequelize.authenticate()
.then(() => sequelize.sync(
    // console.log('Database synced!'),
    {alter: true}
))
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server connected on port ${PORT}...`)
    })
})
.catch(err => console.error('Error: ', err))