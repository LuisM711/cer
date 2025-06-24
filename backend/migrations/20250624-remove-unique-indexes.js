'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.sequelize.transaction(async (t) => {
      
      await queryInterface.renameTable('afiliaciones', 'afiliaciones_old', { transaction: t });

      
      await queryInterface.createTable(
        'afiliaciones',
        {
          id:               { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          razonSocial:      { type: Sequelize.STRING,  allowNull: false },
          nombreComercial:  { type: Sequelize.STRING,  allowNull: false },
          giro:             { type: Sequelize.STRING,  allowNull: false },
          subgiro:          { type: Sequelize.STRING,  allowNull: false },
          paginaWeb:        { type: Sequelize.STRING,  allowNull: true  },
          facebook:         { type: Sequelize.STRING,  allowNull: true  },
          googleMaps:       { type: Sequelize.STRING,  allowNull: true  },
          instagram:        { type: Sequelize.STRING,  allowNull: true  },
          domicilioFiscal:  { type: Sequelize.STRING,  allowNull: false },
          domicilioSucursal:{ type: Sequelize.STRING,  allowNull: false },
          codigoPostal:     { type: Sequelize.STRING,  allowNull: false },
          rfc:              { type: Sequelize.STRING,  allowNull: false },
          telefonoOficina:  { type: Sequelize.STRING,  allowNull: false },
          telefonoPropietario:{ type: Sequelize.STRING,allowNull: false },
          nombrePropietario:{ type: Sequelize.STRING,  allowNull: false },
          emailPropietario: { type: Sequelize.STRING,  allowNull: false },
          fechaNacimientoPropietario: { type: Sequelize.DATEONLY, allowNull: false },
          nombreGerente:    { type: Sequelize.STRING,  allowNull: false },
          telefonoGerente:  { type: Sequelize.STRING,  allowNull: false },
          emailGerente:     { type: Sequelize.STRING,  allowNull: false },
          fechaNacimientoGerente:    { type: Sequelize.DATEONLY, allowNull: false },
          fechaAlta:        { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
          fechaAfiliacion:  { type: Sequelize.DATEONLY, allowNull: false },
          fechaVencimiento: { type: Sequelize.DATEONLY, allowNull: false },
          poliza:           { type: Sequelize.STRING,  allowNull: false },
          polizaUbicacion:  { type: Sequelize.STRING,  allowNull: false },
          numeroFactura:    { type: Sequelize.INTEGER, allowNull: true  },
          importeFactura:   { type: Sequelize.FLOAT,   allowNull: true  },
          isActive:         { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
          createdAt:        { type: Sequelize.DATE,    allowNull: false },
          updatedAt:        { type: Sequelize.DATE,    allowNull: false }
        },
        { transaction: t }
      );

      
      
      await queryInterface.sequelize.query(
        `INSERT INTO afiliaciones
         SELECT * FROM afiliaciones_old;`,
        { transaction: t }
      );

      
      await queryInterface.dropTable('afiliaciones_old', { transaction: t });
    });
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.renameTable('afiliaciones', 'afiliaciones_new', { transaction: t });
      await queryInterface.createTable(
        'afiliaciones',
        {
          id:               { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          razonSocial:      { type: Sequelize.STRING,  allowNull: false, unique: true },
          nombreComercial:  { type: Sequelize.STRING,  allowNull: false, unique: true },
          giro:             { type: Sequelize.STRING,  allowNull: false },
          subgiro:          { type: Sequelize.STRING,  allowNull: false },
          paginaWeb:        { type: Sequelize.STRING,  allowNull: true  },
          facebook:         { type: Sequelize.STRING,  allowNull: true  },
          googleMaps:       { type: Sequelize.STRING,  allowNull: true  },
          instagram:        { type: Sequelize.STRING,  allowNull: true  },
          domicilioFiscal:  { type: Sequelize.STRING,  allowNull: false, unique: true },
          domicilioSucursal:{ type: Sequelize.STRING,  allowNull: false },
          codigoPostal:     { type: Sequelize.STRING,  allowNull: false },
          rfc:              { type: Sequelize.STRING,  allowNull: false, unique: true },
          telefonoOficina:  { type: Sequelize.STRING,  allowNull: false },
          telefonoPropietario:{ type: Sequelize.STRING,allowNull: false },
          nombrePropietario:{ type: Sequelize.STRING,  allowNull: false },
          emailPropietario: { type: Sequelize.STRING,  allowNull: false, unique: true },
          fechaNacimientoPropietario: { type: Sequelize.DATEONLY, allowNull: false },
          nombreGerente:    { type: Sequelize.STRING,  allowNull: false },
          telefonoGerente:  { type: Sequelize.STRING,  allowNull: false },
          emailGerente:     { type: Sequelize.STRING,  allowNull: false, unique: true },
          fechaNacimientoGerente:    { type: Sequelize.DATEONLY, allowNull: false },
          fechaAlta:        { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
          fechaAfiliacion:  { type: Sequelize.DATEONLY, allowNull: false },
          fechaVencimiento: { type: Sequelize.DATEONLY, allowNull: false },
          poliza:           { type: Sequelize.STRING,  allowNull: false },
          polizaUbicacion:  { type: Sequelize.STRING,  allowNull: false },
          numeroFactura:    { type: Sequelize.INTEGER, allowNull: true  },
          importeFactura:   { type: Sequelize.FLOAT,   allowNull: true  },
          isActive:         { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
          createdAt:        { type: Sequelize.DATE,    allowNull: false },
          updatedAt:        { type: Sequelize.DATE,    allowNull: false }
        },
        { transaction: t }
      );
      await queryInterface.sequelize.query(
        `INSERT INTO afiliaciones
         SELECT * FROM afiliaciones_new;`,
        { transaction: t }
      );
      await queryInterface.dropTable('afiliaciones_new', { transaction: t });
    });
  }
};
