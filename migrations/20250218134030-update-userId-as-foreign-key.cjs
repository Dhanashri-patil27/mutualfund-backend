module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('portfolios', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_portfolios_userId', 
      references: {
        table: 'users', 
        field: 'id', 
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('portfolios', 'fk_portfolios_userId');
  },
};
