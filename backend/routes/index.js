const express = require('express');
const router = express.Router();
const verification = require('../middlewares/verification.js');



module.exports = () => {
    router.get('/', (req, res) => {
        return res.json({ message: 'Bienvenido a la API' });
    });



    return router;
}