module.exports.getInfo = async (req, res) => {
    try {
        const token = req.session.token;
        if (token) {
            return res.json({ ...token, logged: true });

        }
        return res.json({ error: 'No autorizado', logged: false });
    } catch (error) {
        return res.status(500).json({ error: error.message, logged: false });

    }

};
module.exports.verifyToken = (req, res, next) => {
    if (req.session.token) {
        return next();
    }
    else {
        return res.status(403).json({ error: 'Debes iniciar sesion' });
    }


}
module.exports.verifyAdmin = (req, res, next) => {
    try {
        if (req.session.token.role === 'admin') {
            return next();
        } else {
            return res.status(401).json({ error: 'No autorizado' });
        }

    } catch (error) {
        return res.status(401).json({ error: 'No autorizado' });

    }


}
module.exports.verifyOperador = (req, res, next) => {
    try {
        if (req.session.token.role === 'operador' || req.session.token.role === 'admin') {
            return next();
        } else {
            return res.status(401).json({ error: 'No autorizado' });
        }

    } catch (error) {
        return res.status(401).json({ error: 'No autorizado' });

    }

}
module.exports.isLogged = (req, res) => {
    if (req.session.token) {
        return res.json({ success: true, role: req.session.token.role });
    } else {
        return res.json({ success: false });
    }
}
module.exports.isAdmin = (req, res) => {
    if (req.session.token && req.session.token.role === 'admin') {
        return res.json({ success: true, role: req.session.token.role });
    } else {
        return res.json({ success: false });
    }
}
module.exports.isOperador = (req, res) => {
    if (req.session.token && (req.session.token.role === 'operador' || req.session.token.role === 'admin')) {
        return res.json({ success: true, role: req.session.token.role });
    } else {
        return res.json({ success: false });
    }
}