const fs = require('fs');
const path = require('path');

module.exports.getDocumento = async (req, res) => {
    try {
        const { id, tipo } = req.params;
        const directory = `./documentos/afiliaciones/${id}`;
        if (!fs.existsSync(directory)) {
            return res.status(404).json({ error: 'Afiliacion no encontrada' });
        }
        const files = fs.readdirSync(directory);
        const fileFound = files.find(file => path.parse(file).name === tipo);
        if (!fileFound) {
            return res.status(404).json({ error: 'Documento no encontrado' });
        }
        const filePath = path.resolve(directory, fileFound);
        return res.sendFile(filePath);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener el documento' });
    }
}