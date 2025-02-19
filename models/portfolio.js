import { DataTypes } from 'sequelize';

const PortfolioModel = (sequelize) => {
  const Portfolio = sequelize.define('portfolios', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    schemeCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schemeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    units: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    purchasePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    currentValue: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    latestNAV: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  }, {
    tableName: 'portfolios',
    freezeTableName: true,
    timestamps: true,
  });

  return Portfolio;
};

export default PortfolioModel;
