import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const DictStates = sequelize.define(
    'DictStates',
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
      tableName: 'dict_states',
      timestamps: false,
    },
  );

  return DictStates;
};
