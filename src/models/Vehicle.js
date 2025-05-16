const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')

class Vehicle extends Model{}

Vehicle.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    chassisNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    manufactureCompany: {
        type: DataTypes.STRING,
        allowNull: false
    },
    manufactureYear: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    modelName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ownerId: {
        type: DataTypes.UUID
    },
    plateNumberId: {
        type: DataTypes.UUID
    }
}, {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'vehicles',
    timestamps: true
})

module.exports = Vehicle