const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database.js');

class Giro extends Model { }
Giro.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    giro: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    subgiro: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
}, {
    sequelize,
    modelName: 'Giro',
    tableName: 'giros',
    timestamps: true,
    hooks: {
        afterSync: async () => {
            const seeds = [
                { giro: "Comercio", subgiro: "Abarrotes" },
                { giro: "Comercio", subgiro: "Electrónica" },
                { giro: "Comercio", subgiro: "Ropa y calzado" },
                { giro: "Comercio", subgiro: "Ferretería" },
                { giro: "Comercio", subgiro: "Paneles solares" },
                { giro: "Comercio", subgiro: "Papelería" },
                { giro: "Comercio", subgiro: "Deportes" },
                { giro: "Restaurante", subgiro: "Pizzería" },
                { giro: "Restaurante", subgiro: "Sushi" },
                { giro: "Restaurante", subgiro: "Café" },
                { giro: "Restaurante", subgiro: "Comida china" },
                { giro: "Restaurante", subgiro: "Tacos" },
                { giro: "Restaurante", subgiro: "Cocina económica" },
                { giro: "Restaurante", subgiro: "Mariscos" },
            ];
            for (const seed of seeds) {
                await Giro.findOrCreate({ where: seed });
            }
        }
    }
});

module.exports = Giro;