import { DataTypes } from "sequelize";

const CacheModel = (sequelize) => {
  const Cache = sequelize.define(
    "cache",
    {
      key: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "cache",
      freezeTableName: true,
      timestamps: true,
    }
  );

  return Cache;
};

export default CacheModel;
