const Admin = require('../models/Admin');

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).json({ error: 'Administrador no encontrado' });
        }

        if (admin.password !== password) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        req.session.token = {
            id: admin.id,
            email: admin.email,
            nombre: admin.nombre,
            telefono: admin.telefono,
            isActive: admin.isActive
        }
        return res.status(200).json({
            id: admin.id,
            nombre: admin.nombre,
            email: admin.email,
            telefono: admin.telefono,
            isActive: admin.isActive
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}

module.exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        return res.status(200).json({ message: 'Sesión cerrada correctamente' });
    });
}                              