import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const DictPriorities = sequelize.define(
    'DictPriorities',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'dict_priorities',
      timestamps: false,
    },
  );

  return DictPriorities;
};
