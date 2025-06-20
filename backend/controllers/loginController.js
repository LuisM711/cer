//loginController.js
const Admin = require('../models/Admin.js');
// const Afiliacion = require('../models/Afiliacion.js');

module.exports.login = async (req, res) => {
    try {

        req.session.token = null;
        const { email, password } = req.body;
        let user = null;
        let role = '';

        user = await Admin.findOne({ where: { email } });
        if (user && user.password === password) {
            role = user.tipo;
        } else {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        req.session.token = { id: user.id, role };
        return res.status(200).json({ message: 'Login exitoso', role });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el login' });
    }
};

module.exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        return res.status(200).json({ message: 'Sesión cerrada correctamente' });
    });
}                              