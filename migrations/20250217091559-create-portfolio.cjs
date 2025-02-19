'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('portfolios', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      schemeCode: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      schemeName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      units: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      purchasePrice: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      purchaseDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('portfolios');
  }
};

