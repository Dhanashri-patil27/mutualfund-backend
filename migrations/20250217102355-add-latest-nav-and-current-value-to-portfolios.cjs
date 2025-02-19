'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('portfolios', 'latestNAV', {
      type: Sequelize.FLOAT,
      allowNull: true, 
    });
    await queryInterface.addColumn('portfolios', 'currentValue', {
      type: Sequelize.FLOAT,
      allowNull: true, 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('portfolios', 'latestNAV');
    await queryInterface.removeColumn('portfolios', 'currentValue');
  }
};
