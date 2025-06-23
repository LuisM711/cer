const express = require('express');
const router = express.Router();
const verification = require('../middlewares/verification.js');

const afiliacionController = require('../controllers/afiliacionController.js');
const documentosController = require('../controllers/documentosController.js');
const adminController = require('../controllers/adminController.js');
const loginController = require('../controllers/loginController.js');
const giroController = require('../controllers/giroController.js');

module.exports = () => {
    router.get('/', (req, res) => {
        return res.json({ message: 'Bienvenido a la API' });
    });

    router.post('/afiliaciones', verification.verifyOperador, afiliacionController.createAfiliacion);
    router.get('/afiliaciones', verification.verifyToken, afiliacionController.getAfiliaciones);
    router.get('/afiliaciones/:id', verification.verifyToken, afiliacionController.getAfiliacionById);

    router.put('/afiliaciones/:id', verification.verifyOperador, afiliacionController.updateAfiliacion);
    router.get('/afiliaciones/giro/:giro', verification.verifyToken, afiliacionController.getAfiliacionByGiro);
    router.get('/documentos/:id/:tipo', verification.verifyToken, documentosController.getDocumento);
    router.get('/afiliaciones/nombre/:nombreComercial/:giro', verification.verifyToken, afiliacionController.getAfiliacionPorNombreYGiro);
    router.get('/birthdays', verification.verifyToken, afiliacionController.getBirthdays);

    /**
     * module.exports.actualizarFechaVencimiento = async (req, res) => {
    try {
        const id = req.params.id;
        const { fechaVencimiento } = req.body;
     */
    router.put('/actualizarFechaVencimiento/:id', verification.verifyAdmin, afiliacionController.actualizarFechaVencimiento);



    router.post('/crear-admin', verification.verifyAdmin, adminController.createAdmin);
    router.get('/admins', verification.verifyAdmin, adminController.getAdmins);
    router.get('/admins/:id', verification.verifyAdmin, adminController.getAdminById);
    router.put('/admins/:id', verification.verifyAdmin, adminController.updateAdmin);
    router.delete('/admins/:id', verification.verifyAdmin, adminController.deleteAdmin);

    //login
    router.post('/login', loginController.login);
    router.get('/logout', loginController.logout);

    //verification.verifyToken,
    router.get('/getInfo', verification.verifyToken, verification.getInfo);
    router.get('/verifyToken', verification.isLogged);
    router.get('/verifyOperador', verification.isOperador);
    router.get('/verifyAdmin', verification.isAdmin);
    // router.get('/verifyAfiliado', verification.isAfiliado);

    router.get('/mis-datos', afiliacionController.getMiAfiliacion);

    //Giros
    router.get('/giros', verification.verifyToken, giroController.getGiros);
    router.get('/giros/:id', verification.verifyToken, giroController.getGiroById);
    router.post('/giros', verification.verifyAdmin, giroController.createSubgiro);
    router.put('/giros/:id', verification.verifyAdmin, giroController.updateSubgiro);



    return router;
}