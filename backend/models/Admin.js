const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database.js');

class Admin extends Model { }
Admin.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
}, {

    hooks: {
        afterSync: async () => {
            await Admin.findOrCreate({
                where: { nombre: "Luis Mario Lopez", email: 'luismario.lr46@gmail.com', password: 'Luis1234', telefono: '1234567890', isActive: true },
            });
        }
    },

    sequelize,
    modelName: 'Admin',
    tableName: 'admins',
    timestamps: true
});
module.exports = Admin;