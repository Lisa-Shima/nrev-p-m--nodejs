const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')

class User extends Model{}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    names: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nationalId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('ROLE_STANDARD', 'ROLE_ADMIN'),
        defaultValue: 'ROLE_STANDARD'
    }
},
{
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
})

module.exports = User