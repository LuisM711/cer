const Giro = require('../models/Giro.js');
const Afiliacion = require('../models/Afiliacion.js');

module.exports.getGiros = async (req, res) => {
    try {
        const giros = await Giro.findAll();
        return res.status(200).json(giros);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los giros' });
    }
}

module.exports.getGiroById = async (req, res) => {
    try {
        const giro = await Giro.findByPk(req.params.id);
        if (!giro) {
            return res.status(404).json({ error: 'Giro no encontrado' });
        }
        return res.status(200).json(giro);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener el giro' });
    }
}

module.exports.createSubgiro = async (req, res) => {
    try {
        const { giro, subgiro } = req.body;
        if (!giro) {
            return res.status(400).json({ error: 'El campo "giro" es obligatorio' });
        }
        const newGiro = await Giro.create({ giro, subgiro });
        return res.status(201).json(newGiro);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear el giro' });
    }
}

module.exports.updateSubgiro = async (req, res) => {
    try {
        /**
         * const { Model, DataTypes } = require('sequelize');
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
         }
         */
        const { giro, subgiro } = req.body;
        const giroInstance = await Giro.findByPk(req.params.id);
        if (!giroInstance) {
            return res.status(404).json({ error: 'Giro no encontrado' });
        }
        giroInstance.giro = giro;
        giroInstance.subgiro = subgiro;
        await giroInstance.save();
        console.log(giroInstance);
        
        await Afiliacion.update(
            {  subgiro },
            { where: { giro: giro } }
        );
        return res.status(200).json(giroInstance);


        return res.status(200).json(updatedGiro[1][0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar el giro' });
    }
}

