const express = require('express');
const router = express.Router();
const verification = require('../middlewares/verification.js');

const afiliacionController = require('../controllers/afiliacionController.js');
const documentosController = require('../controllers/documentosController.js');


module.exports = () => {
    router.get('/', (req, res) => {
        return res.json({ message: 'Bienvenido a la API' });
    });

    router.post('/afiliaciones', afiliacionController.createAfiliacion);
    router.get('/afiliaciones', afiliacionController.getAfiliaciones);
    router.get('/afiliaciones/:id', afiliacionController.getAfiliacionById);

    router.get('/afiliaciones/giro/:giro', afiliacionController.getAfiliacionByGiro);
    router.get('/documentos/:id/:tipo', documentosController.getDocumento);
    router.get('/afiliaciones/nombre/:nombreComercial/:giro', afiliacionController.getAfiliacionPorNombreYGiro);
    router.get('/birthdays', afiliacionController.getBirthdays);

    return router;
}