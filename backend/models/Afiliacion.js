// models/Afiliacion.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database.js');

class Afiliacion extends Model { }

Afiliacion.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // --- Datos Generales ---
    razonSocial: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nombreComercial: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    giro: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subgiro: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // --- Contacto y Redes ---
    paginaWeb: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    facebook: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    googleMaps: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    instagram: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // --- Ubicación ---
    domicilioFiscal: {
        type: DataTypes.STRING,
        allowNull: false
    },
    domicilioSucursal: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    codigoPostal: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // --- Identificación Fiscal ---
    rfc: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^([A-ZÑ&]{3,4})-?([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])-?([A-Z\d]{3})$/i
        }
    },

    // --- Teléfonos ---
    telefonoOficina: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefonoPropietario: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // --- Propietario ---
    nombrePropietario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emailPropietario: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    fechaNacimientoPropietario: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    // --- Gerente ---
    nombreGerente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefonoGerente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emailGerente: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    fechaNacimientoGerente: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    // --- Fechas de Proceso ---
    fechaAlta: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    fechaAfiliacion: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaVencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    // --- Pólizas ---
    poliza: {
        type: DataTypes.STRING,
        allowNull: false
    },
    polizaUbicacion: {
        type: DataTypes.STRING,
        allowNull: false
    },

    numeroFactura: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    importeFactura: {
        type: DataTypes.FLOAT,
        allowNull: true
    },

    // --- Estado ---
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Afiliacion',
    tableName: 'afiliaciones',
    timestamps: true,
    indexes: [
        // { unique: true, fields: ['razonSocial'] },
        // { unique: true, fields: ['nombreComercial'] },
        // { unique: true, fields: ['domicilioFiscal'] },
        // { unique: true, fields: ['rfc'] },
        // { unique: true, fields: ['emailPropietario'] },
        // { unique: true, fields: ['emailGerente'] }
    ],
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
            const count = await Afiliacion.count();
            if (count === 0) {
                await Afiliacion.bulkCreate([
                    {
                        razonSocial: 'Flexi S.A. de C.V.',
                        nombreComercial: 'Flexi',
                        giro: 'Comercio',
                        subgiro: 'Ropa y calzado',
                        paginaWeb: 'https://www.flexi.com',
                        facebook: 'https://www.flexi.com/flexi',
                        googleMaps: 'https://www.google.com/maps/place/flexi',
                        instagram: 'https://www.instagram.com/flexi',
                        domicilioFiscal: 'Av. Demo 123, Ciudad, Estado, CP 00000',
                        domicilioSucursal: 'Av. Demo 123, Ciudad, Estado, CP 00000',
                        codigoPostal: '81220',
                        rfc: 'LORL031220DV8',
                        telefonoOficina: '5550000000',
                        telefonoPropietario: '5550001111',
                        nombrePropietario: 'Juan Pérez',
                        emailPropietario: 'juan.perez@example.com',
                        fechaNacimientoPropietario: '1980-06-16',
                        nombreGerente: 'María López',
                        telefonoGerente: '5550002222',
                        emailGerente: 'maria.lopez@example.com',
                        fechaNacimientoGerente: '1985-10-20',
                        fechaAfiliacion: '2025-06-16',
                        fechaVencimiento: '2026-06-16',
                        poliza: 'POL123456',
                        polizaUbicacion: '1',
                        numeroFactura: 123456,
                        importeFactura: 1500.00,
                    },
                    {

                        razonSocial: 'Chinaloa SA de C.V.',
                        nombreComercial: 'Chinaloa',
                        giro: 'Restaurante',
                        subgiro: 'Comida china',
                        paginaWeb: 'https://www.chinaloa.com',
                        facebook: 'https://www.chinaloa.com/chinaloa',
                        googleMaps: 'https://www.google.com/maps/place/chinaloa',
                        instagram: 'https://www.instagram.com/chinaloa',
                        domicilioFiscal: 'Av. chinaloa 123, Ciudad, Estado',
                        domicilioSucursal: 'Av. chinaloa 123, Ciudad, Estado',
                        codigoPostal: '81229',
                        rfc: 'LORL031220DV9',
                        telefonoOficina: '5550001234',
                        telefonoPropietario: '5555431111',
                        nombrePropietario: 'Juan Luna',
                        emailPropietario: 'juan.luna@example.com',
                        fechaNacimientoPropietario: '1980-05-15',
                        nombreGerente: 'María Izaguirre',
                        telefonoGerente: '5551232222',
                        emailGerente: 'maria.iza@example.com',
                        fechaNacimientoGerente: '1975-10-20',
                        fechaAfiliacion: '2025-06-17',
                        fechaVencimiento: '2026-06-18',
                        poliza: 'POL213456',
                        polizaUbicacion: '2',
                        numeroFactura: 123456,
                        importeFactura: 1500.00,

                    },
                    {
                        razonSocial: 'Sushi House S.A. de C.V.',
                        nombreComercial: 'Sushi House - La casa del sushi',
                        giro: 'Restaurante',
                        subgiro: 'Sushi',
                        paginaWeb: 'https://www.sushihouse.com',
                        facebook: 'https://www.sushihouse.com/sushihouse',
                        googleMaps: 'https://www.google.com/maps/place/sushihouse',
                        instagram: 'https://www.instagram.com/sushihouse',
                        domicilioFiscal: 'Av. sushihouse 123, Ciudad, Estado',
                        domicilioSucursal: 'Av. sushihouse 123, Ciudad, Estado',
                        codigoPostal: '81229',
                        rfc: 'LORL031220DV1',
                        telefonoOficina: '4440001234',
                        telefonoPropietario: '4444431111',
                        nombrePropietario: 'Juan Molina',
                        emailPropietario: 'sushihouse@sushihouse.com',
                        fechaNacimientoPropietario: '1989-08-15',
                        nombreGerente: 'Daniel Izaguirre',
                        telefonoGerente: '5551232222',
                        emailGerente: 'daniel.iza@example.com',
                        fechaNacimientoGerente: '1955-10-20',
                        fechaAfiliacion: '2025-06-11',
                        fechaVencimiento: '2026-06-20',
                        poliza: 'POL216556',
                        polizaUbicacion: '3',
                        numeroFactura: 123456,
                        importeFactura: 1500.00,

                    },
                    {

                        razonSocial: 'Kita Crudas S.A. de C.V.',
                        nombreComercial: 'Kita-Crudas mariscos',
                        giro: 'Restaurante',
                        subgiro: 'Mariscos',
                        paginaWeb: 'https://www.kitacrudas.com',
                        facebook: 'https://www.kitacrudas.com/kitacrudas',
                        googleMaps: 'https://www.google.com/maps/place/kitacrudas',
                        instagram: 'https://www.instagram.com/kitacrudas',
                        domicilioFiscal: 'Av. kitacrudas 123, Ciudad, Estado',
                        domicilioSucursal: 'Av. kitacrudas 123, Ciudad, Estado',
                        codigoPostal: '81229',
                        rfc: 'LORL031220DV5',
                        telefonoOficina: '4441231234',
                        telefonoPropietario: '4456731111',
                        nombrePropietario: 'Miguel Pérez',
                        emailPropietario: 'kitacrudas@kitacrudas.com',
                        fechaNacimientoPropietario: '1989-06-20',
                        nombreGerente: 'Luis Flores',
                        telefonoGerente: '5551232782',
                        emailGerente: 'luis.flores@example.com',
                        fechaNacimientoGerente: '1955-10-20',
                        fechaAfiliacion: '2025-06-11',
                        fechaVencimiento: '2026-06-20',
                        poliza: 'POL916556',
                        polizaUbicacion: '4',
                        numeroFactura: 123456,
                        importeFactura: 1500.00,

                    },

                ], { validate: true });
            }
        }
    }
});
module.exports = Afiliacion;
