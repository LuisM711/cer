'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Si estamos en SQLite, saltamos (su removeColumn/addColumn falla al recrear tablas)
    if (queryInterface.sequelize.options.dialect === 'sqlite') {
      console.log('== remove-rfc-validation: sqlite detected, skipping column change');
      return;
    }

    // Para otros dialectos (Postgres, MySQL, etc.) redefinimos la columna SIN ninguna validación
    await queryInterface.changeColumn(
      'afiliaciones',
      'rfc',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Igual: no hacemos nada en SQLite
    if (queryInterface.sequelize.options.dialect === 'sqlite') {
      console.log('== remove-rfc-validation [down]: sqlite detected, skipping');
      return;
    }

    // En el down, restauramos la misma definición (sin validación también)
    await queryInterface.changeColumn(
      'afiliaciones',
      'rfc',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
  }
};
