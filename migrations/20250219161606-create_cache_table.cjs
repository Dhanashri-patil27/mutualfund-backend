module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("cache", {
      key: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("cache");
  },
};
