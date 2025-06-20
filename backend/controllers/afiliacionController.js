const Afiliacion = require('../models/Afiliacion.js');
const { Op, literal } = require('sequelize');
const path = require('path');
const fs = require('fs/promises');
module.exports.createAfiliacion = async (req, res) => {
    try {
        const afiliacion = await Afiliacion.create(req.body);
        const id = afiliacion.id;
        const uploadDir = path.join(__dirname, '..', 'documentos', 'afiliaciones', String(id));

        if (req.files) {
            const documentos = [
                'comprobanteSucursal',
                'comprobanteMatriz',
                'ine',
                'csf',
                'logoPdf',
                'logoPng'
            ];

            try {
                await fs.rm(uploadDir, { recursive: true, force: true });
            } catch (err) {

            }
            await fs.mkdir(uploadDir, { recursive: true });
            for (const key of documentos) {
                const file = req.files[key];
                if (file) {
                    const ext = file.mimetype.split('/')[1];
                    const filename = `${key}.${ext}`;
                    const destPath = path.join(uploadDir, filename);
                    await file.mv(destPath);
                    afiliacion[key] = `/documentos/afiliaciones/${id}/${filename}`;
                }
            }

            await afiliacion.save();
        }

        return res.status(201).json(afiliacion);
    } catch (error) {
        console.error('Error en createAfiliacion:', error);
        return res
            .status(500)
            .json({ error: 'Error al crear la afiliación' });
    }
};
module.exports.updateAfiliacion = async (req, res) => {
    const id = req.params.id;
    try {
        const afiliacion = await Afiliacion.findByPk(id);
        if (!afiliacion) {
            return res.status(404).json({ error: 'Afiliación no encontrada' });
        }
        await afiliacion.update(req.body);
        if (req.files && Object.keys(req.files).length) {
            const uploadDir = path.join(__dirname, '..', 'documentos', 'afiliaciones', String(id));
            await fs.mkdir(uploadDir, { recursive: true });
            const documentos = [
                'comprobanteSucursal',
                'comprobanteMatriz',
                'ine',
                'csf',
                'logoPdf',
                'logoPng'
            ];

            for (const key of documentos) {
                const file = req.files[key];
                if (!file) continue;

                const ext = file.mimetype.split('/')[1];
                const filename = `${key}.${ext}`;
                const destPath = path.join(uploadDir, filename);

                await file.mv(destPath);

                afiliacion[key] = `/documentos/afiliaciones/${id}/${filename}`;
            }

            await afiliacion.save();
        }

        return res.json(afiliacion);

    } catch (error) {
        console.error('Error en updateAfiliacion:', error);
        return res.status(500).json({ error: 'Error al actualizar la afiliación' });
    }
};

module.exports.getAfiliaciones = async (req, res) => {
    try {
        const afiliaciones = await Afiliacion.findAll();
        return res.status(200).json(afiliaciones);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener las afiliaciones' });
    }
}

module.exports.getAfiliacionById = async (req, res) => {
    try {
        const afiliacion = await Afiliacion.findByPk(req.params.id);
        if (!afiliacion) {
            return res.status(404).json({ error: 'Afiliación no encontrada' });
        }
        return res.status(200).json(afiliacion);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener la afiliación' });
    }
}
module.exports.getAfiliacionByGiro = async (req, res) => {
    try {
        const afiliacion = await Afiliacion.findAll({
            where: {
                giro: req.params.giro
            }
        });
        if (!afiliacion) {
            return res.status(404).json({ error: 'Afiliación no encontrada' });
        }
        return res.status(200).json(afiliacion);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener la afiliación' });
    }
}
module.exports.getAfiliacionPorNombreYGiro = async (req, res) => {
    try {
        const afiliacion = await Afiliacion.findAll({
            where: {
                nombreComercial: {
                    [Op.like]: `%${req.params.nombreComercial}%`
                },
                giro: req.params.giro
            }
        });
        if (!afiliacion) {
            return res.status(404).json({ error: 'Afiliación no encontrada' });
        }
        return res.status(200).json(afiliacion);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener la afiliación' });
    }
}
module.exports.getBirthdays = async (req, res) => {
    try {
        const today = new Date();
        const from = new Date(today);
        const to = new Date(today);
        from.setDate(today.getDate() - 15);
        to.setDate(today.getDate() + 30);

        const fromStr = from.toISOString().slice(5, 10);
        const toStr = to.toISOString().slice(5, 10);

        const cruzaAño = fromStr > toStr;

        const whereCondition = cruzaAño
            ? literal(`strftime('%m-%d', fechaNacimientoPropietario) >= '${fromStr}' OR strftime('%m-%d', fechaNacimientoPropietario) <= '${toStr}'`)
            : literal(`strftime('%m-%d', fechaNacimientoPropietario) BETWEEN '${fromStr}' AND '${toStr}'`);

        const afiliaciones = await Afiliacion.findAll({
            where: whereCondition
        });

        if (afiliaciones.length === 0) {
            return res.status(204).json({ message: 'No hay cumpleaños en el rango especificado', flag: false });
        }

        return res.status(200).json({ data: afiliaciones, flag: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los cumpleaños' });
    }
};
module.exports.getMiAfiliacion = async (req, res) => {
    try {
        const id = req.session.token.id;

        const afiliacion = await Afiliacion.findOne({
            where: {
                id: id
            }
        });
        if (!afiliacion) {
            return res.status(404).json({ error: 'Afiliación no encontrada' });
        }
        return res.status(200).json(afiliacion);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener la afiliación' });
    }
}

module.exports.actualizarFechaVencimiento = async (req, res) => {
    try {
        const id = req.params.id;
        const { fechaVencimiento } = req.body;

        const afiliacion = await Afiliacion.findByPk(id);
        if (!afiliacion) {
            return res.status(404).json({ error: 'Afiliación no encontrada' });
        }

        afiliacion.fechaVencimiento = fechaVencimiento;
        await afiliacion.save();

        return res.status(200).json({ message: 'Fecha de vencimiento actualizada correctamente', afiliacion });
    } catch (error) {
        console.error('Error al actualizar la fecha de vencimiento:', error);
        return res.status(500).json({ error: 'Error al actualizar la fecha de vencimiento' });
    }
}