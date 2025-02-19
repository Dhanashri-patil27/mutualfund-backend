'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('portfolios', 'schemeCode', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('portfolios', 'schemeCode', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
