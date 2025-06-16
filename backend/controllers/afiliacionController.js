const Afiliacion = require('../models/Afiliacion.js');
const { Op, literal } = require('sequelize');

module.exports.createAfiliacion = async (req, res) => {
    try {
        const afiliacion = await Afiliacion.create(req.body);
        const id = afiliacion.id;
        // documentos: ['comprobanteSucursal', 'comprobanteMatriz', 'ine', 'csf', 'logoPdf', 'logoPng']
        // ubicaciones = /documentos/afiliaciones/['${id}_comprobanteSucursal', '${id}_comprobanteMatriz', '${id}_ine', '${id}_csf', '${id}_logoPdf', '${id}_logoPng']

        if (req.files) {
            const documentos = ['comprobanteSucursal', 'comprobanteMatriz', 'ine', 'csf', 'logoPdf', 'logoPng'];
            const ubicaciones = documentos.map(doc => `/documentos/afiliaciones/${id}/${doc}.${req.files[doc].mimetype.split('/')[1]}`);
            //eliminar la carpeta si existe
            const fs = require('fs');
            const dir = `./documentos/afiliaciones/${id}`;
            if (fs.existsSync(dir)) {
                fs.rmdirSync(dir, {
                    recursive: true
                });
            }
            for (let i = 0; i < documentos.length; i++) {
                if (req.files[documentos[i]]) {
                    const file = req.files[documentos[i]];
                    await file.mv(`.${ubicaciones[i]}`);
                    afiliacion[documentos[i]] = ubicaciones[i];
                }
            }
        }

        return res.status(201).json(afiliacion);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear la afiliación' });
    }
}


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

    const fromStr = from.toISOString().slice(5, 10); // MM-DD
    const toStr = to.toISOString().slice(5, 10);     // MM-DD

    const cruzaAño = fromStr > toStr;

    const whereCondition = cruzaAño
      ? literal(`strftime('%m-%d', fechaNacimiento) >= '${fromStr}' OR strftime('%m-%d', fechaNacimiento) <= '${toStr}'`)
      : literal(`strftime('%m-%d', fechaNacimiento) BETWEEN '${fromStr}' AND '${toStr}'`);

    const afiliaciones = await Afiliacion.findAll({
      where: whereCondition
    });

    if (afiliaciones.length === 0) {
      return res.status(404).json({ message: 'No hay cumpleaños en el rango especificado', flag: false });
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