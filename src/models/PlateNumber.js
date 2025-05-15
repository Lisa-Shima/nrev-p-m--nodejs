const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')

class PlateNumber extends Model{}

PlateNumber.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    issuedDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('AVAILABLE', 'INUSE'),
        defaultValue: 'AVAILABLE'
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'PlateNumber',
    tableName: 'platenumbers',
    timestamps: true
})

module.exports = PlateNumber