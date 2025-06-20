const Admin = require('../models/Admin');


module.exports.createAdmin = async (req, res) => {
    try {
        const { nombre, email, password, telefono, tipo } = req.body;

        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({ error: 'El administrador ya existe' });
        }
        const newAdmin = await Admin.create({
            nombre,
            email,
            password,
            telefono,
            tipo
        });
        return res.status(201).json(newAdmin);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear el administrador' });
    }
}
module.exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll();
        return res.status(200).json(admins);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los administradores' });
    }
}
module.exports.getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.id);
        if (!admin) {
            return res.status(404).json({ error: 'Administrador no encontrado' });
        }
        return res.status(200).json(admin);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener el administrador' });
    }
}
module.exports.updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, password, telefono, isActive } = req.body;

        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ error: 'Administrador no encontrado' });
        }

        admin.nombre = nombre || admin.nombre;
        admin.email = email || admin.email;
        admin.password = password || admin.password;
        admin.telefono = telefono || admin.telefono;
        admin.isActive = isActive !== undefined ? isActive : admin.isActive;

        await admin.save();
        return res.status(200).json(admin);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar el administrador' });
    }
}


module.exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ error: 'Administrador no encontrado' });
        }

        admin.isActive = false;
        await admin.save();
        return res.status(200).json({ message: 'Administrador eliminado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar el administrador' });
    }
}