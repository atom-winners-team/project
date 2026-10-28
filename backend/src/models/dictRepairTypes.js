import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const DictRepairTypes = sequelize.define(
    'DictRepairTypes',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'dict_repair_types',
      timestamps: false,
    },
  );

  return DictRepairTypes;
};
