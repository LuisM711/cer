// /models/Admin.js
const { Model, DataTypes } = require('sequelize')
const sequelize = require('../database.js')

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
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Admin',
    tableName: 'admins',
    timestamps: true,
    hooks: {
        afterSync: async () => {
            const count = await Admin.count();
            if (count === 0) {
                await Admin.bulkCreate([
                    {
                        email: 'luismario.lr46@gmail.com',
                        nombre: 'Luis Mario Lopez',
                        password: 'Luis1234',
                        telefono: '1234567890',
                        tipo: 'admin',
                        isActive: true
                    },
                    {
                        email: 'mariozazueta@metropizza.com.mx',
                        nombre: 'Mario Zazueta',
                        password: 'MarioZazueta1234',
                        telefono: '6681380825',
                        tipo: 'admin',
                        isActive: true
                    },
                    {
                        email: 'gerencia@consejoempresarialrestaurantero.com',
                        nombre: 'Operador Consejo Empresarial',
                        password: 'OperadorCER1234',
                        telefono: '6681380825',
                        tipo: 'operador',
                        isActive: true
                    },
                    {
                        email: 'operador@test.com',
                        nombre: 'Operador Test',
                        password: 'Operador1234',
                        telefono: '0987654321',
                        tipo: 'operador',
                        isActive: true
                    },
                    {
                        email: 'consejorestaurantero@gmail.com',
                        nombre: 'Consejo Empresarial Restaurantero',
                        password: 'CER1234',
                        telefono: '1234567890',
                        tipo: 'solover',
                        isActive: true
                    }

                ], { validate: true });
            }
        }
    }
});
module.exports = Admin;
