const {Sequelize} = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize('nombreBD', 'usuarioBD', 'contraBD', {
    dialect: 'sqlite',
    host: './db.sqlite3'
});
module.exports = sequelize;