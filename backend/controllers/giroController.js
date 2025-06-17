const Giro = require('../models/Giro.js');

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

module.exports.createGiro = async (req, res) => {
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

module.exports.updateGiro = async (req, res) => {
    try {
        const { giro, subgiro } = req.body;
        const updatedGiro = await Giro.update(
            { giro, subgiro },
            { where: { id: req.params.id }, returning: true }
        );
        if (!updatedGiro[0]) {
            return res.status(404).json({ error: 'Giro no encontrado' });
        }
        return res.status(200).json(updatedGiro[1][0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar el giro' });
    }
}

module.exports.deleteGiro = async (req, res) => {
    try {
        const deleted = await Giro.destroy({ where: { id: req.params.id } });
        if (!deleted) {
            return res.status(404).json({ error: 'Giro no encontrado' });
        }
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar el giro' });
    }
}

