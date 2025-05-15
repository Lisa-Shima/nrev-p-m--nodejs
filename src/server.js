require('dotenv').config()
const express = require('express')
const sequelize = require('./config/database')
const authRoutes = require('./routes/authRoutes')

const app = express()
require('./models/User')

app.use(express.json())

app.use('/auth', authRoutes)

const PORT = process.env.PORT || 4500
sequelize.authenticate()
.then(() => sequelize.sync(
    console.log('Database synced!')
))
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server connected on port ${PORT}...`)
    })
})
.catch(err => console.error('Error: ', err))