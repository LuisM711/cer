const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database.js');

class Afiliacion extends Model { }
Afiliacion.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    razonSocial: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nombreComercial: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    giro: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subgiro: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
        // validate: {
        //     isEmail: true
        // }
    },
    paginaWeb: {
        type: DataTypes.STRING,
        allowNull: true
    },
    facebook: {
        type: DataTypes.STRING,
        allowNull: true
    },
    googleMaps: {
        type: DataTypes.STRING,
        allowNull: true
    },
    instagram: {
        type: DataTypes.STRING,
        allowNull: true
    },
    domicilioFiscal: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    domicilioSucursal: {
        type: DataTypes.STRING,
        allowNull: false

    },
    rfc: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    telefonoOficina: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telefonoPropietario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    //  
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },



},

    {
        hooks: {
            beforeCreate: (afiliacion, options) => {
                // Aquí puedes agregar lógica antes de crear una afiliación
                // Por ejemplo, validar datos o formatear campos
            },
            beforeUpdate: (afiliacion, options) => {
                // Aquí puedes agregar lógica antes de actualizar una afiliación
                // Por ejemplo, validar datos o formatear campos
            },
            afterSync: async (options) => {
                await Afiliacion.findOrCreate({
                    where: {
                        razonSocial: 'Flexi S.A. de C.V.',
                        nombreComercial: 'Flexi',
                        giro: 'Comercio',
                        subgiro: 'Ropa y calzado',
                        email: 'flexi@flexi.com',
                        paginaWeb: 'https://www.flexi.com',
                        facebook: 'https://www.flexi.com/flexi',
                        googleMaps: 'https://www.google.com/maps/place/flexi',
                        instagram: 'https://www.instagram.com/flexi',
                        domicilioFiscal: 'Calle Falsa 321, Ciudad, Estado, CP 12345',
                        domicilioSucursal: 'Calle Falsa 321, Ciudad, Estado, CP 12345',
                        rfc: 'XAXX010101000',
                        telefonoOficina: '1234567890',
                        telefonoPropietario: '0987654321',
                        fechaNacimiento: new Date('2000-01-01'),
                        isActive: true

                    },
                }),
                await Afiliacion.findOrCreate({
                    where: {
                        razonSocial: 'Chinaloa S.A. de C.V.',
                        nombreComercial: 'Chinaloa',
                        giro: 'Restaurante',
                        subgiro: 'Comida china',
                        email: 'chinaloa@chinaloa.com',
                        paginaWeb: 'https://www.chinaloa.com',
                        facebook: 'https://www.chinaloa.com/chinaloa',
                        googleMaps: 'https://www.google.com/maps/place/chinaloa',
                        instagram: 'https://www.instagram.com/chinaloa',
                        domicilioFiscal: 'Calle Falsa 123, Ciudad, Estado, CP 12345',
                        domicilioSucursal: 'Calle Falsa 123, Ciudad, Estado, CP 12345',
                        rfc: 'XAXX010101012',
                        telefonoOficina: '1234567890',
                        telefonoPropietario: '0987654321',
                        fechaNacimiento: new Date('2000-01-01'),
                        isActive: true

                    },
                }),
                await Afiliacion.findOrCreate({
                    where: {
                        razonSocial: 'Sushi House S.A. de C.V.',
                        nombreComercial: 'Sushi House - La casa del sushi',
                        giro: 'Restaurante',
                        subgiro: 'Sushi',
                        email: 'sushihouse@sushihouse.com',
                        paginaWeb: 'https://www.sushihouse.com',
                        facebook: 'https://www.sushihouse.com/sushihouse',
                        googleMaps: 'https://www.google.com/maps/place/sushihouse',
                        instagram: 'https://www.instagram.com/sushihouse',
                        domicilioFiscal: 'Calle sushihouse 123, Ciudad, Estado, CP 12345',
                        domicilioSucursal: 'Calle sushihouse 123, Ciudad, Estado, CP 12345',
                        rfc: 'XAXX010101234',
                        telefonoOficina: '123123123',
                        telefonoPropietario: '321321321',
                        fechaNacimiento: new Date('2000-06-10'),
                        isActive: true

                    },
                }),
                await Afiliacion.findOrCreate({
                    where: {
                        razonSocial: 'Kita Crudas S.A. de C.V.',
                        nombreComercial: 'Kita-Crudas mariscos',
                        giro: 'Restaurante',
                        subgiro: 'Mariscos',
                        email: 'kitacrudas@kitacrudas.com',
                        paginaWeb: 'https://www.kitacrudas.com',
                        facebook: 'https://www.kitacrudas.com/kitacrudas',
                        googleMaps: 'https://www.google.com/maps/place/kitacrudas',
                        instagram: 'https://www.instagram.com/kitacrudas',
                        domicilioFiscal: 'Calle kitacrudas 123, Ciudad, Estado, CP 12345',
                        domicilioSucursal: 'Calle kitacrudas 123, Ciudad, Estado, CP 12345',
                        rfc: 'XAXX010105646',
                        telefonoOficina: '91919191',
                        telefonoPropietario: '32323232',
                        fechaNacimiento: new Date('2000-06-20'),
                        isActive: true

                    },
                })
            }
        },
        sequelize,
        modelName: 'Afiliacion',
        tableName: 'afiliaciones',
        // timestamps: true
    });

module.exports = Afiliacion;