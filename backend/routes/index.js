const express = require('express');
const router = express.Router();
const verification = require('../middlewares/verification.js');

const afiliacionController = require('../controllers/afiliacionController.js');
const documentosController = require('../controllers/documentosController.js');
const adminController = require('../controllers/adminController.js');
const loginController = require('../controllers/loginController.js');

module.exports = () => {
    router.get('/', (req, res) => {
        return res.json({ message: 'Bienvenido a la API' });
    });

    router.post('/afiliaciones',verification.verifyToken, afiliacionController.createAfiliacion);
    router.get('/afiliaciones',verification.verifyToken, afiliacionController.getAfiliaciones);
    router.get('/afiliaciones/:id',verification.verifyToken, afiliacionController.getAfiliacionById);

    router.get('/afiliaciones/giro/:giro',verification.verifyToken, afiliacionController.getAfiliacionByGiro);
    router.get('/documentos/:id/:tipo',verification.verifyToken, documentosController.getDocumento);
    router.get('/afiliaciones/nombre/:nombreComercial/:giro',verification.verifyToken, afiliacionController.getAfiliacionPorNombreYGiro);
    router.get('/birthdays', afiliacionController.getBirthdays);

    router.post('/crear-admin',verification.verifyToken, adminController.createAdmin);
    router.get('/admins',verification.verifyToken, adminController.getAdmins);
    router.get('/admins/:id',verification.verifyToken, adminController.getAdminById);
    router.put('/admins/:id',verification.verifyToken, adminController.updateAdmin);
    router.delete('/admins/:id',verification.verifyToken, adminController.deleteAdmin);

    //login
    router.post('/login', loginController.login);
    router.post('/logout', loginController.logout);

    //verification.verifyToken,

    router.get('/info', verification.getInfo);


    return router;
}