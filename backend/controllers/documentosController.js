
const fs = require('fs');
const path = require('path');

module.exports.getDocumento = async (req, res) => {
    try {
        const { id, tipo } = req.params;
        const dir = path.join(__dirname, '../documentos/afiliaciones', id);

        if (!fs.existsSync(dir)) {
            return res.status(404).json({ error: 'Afiliación no encontrada' });
        }

        const files = fs.readdirSync(dir);
        const fileName = files.find(f => path.parse(f).name === tipo);
        if (!fileName) {
            return res.status(404).json({ error: 'Documento no encontrada' });
        }

        const filePath = path.join(dir, fileName);
        const fileData = fs.readFileSync(filePath); // Leer el archivo completo

        let contentType = 'application/octet-stream';
        const ext = path.extname(fileName).toLowerCase();
        
        if (ext === '.pdf') contentType = 'application/pdf';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

        res.setHeader('Content-Type', contentType);
        
        const disposition = tipo === 'logoPng' 
            ? 'inline' 
            : `attachment; filename="${fileName}"`;
        res.setHeader('Content-Disposition', disposition);

        // Enviar como buffer en lugar de stream
        res.send(fileData);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el documento' });
    }
};