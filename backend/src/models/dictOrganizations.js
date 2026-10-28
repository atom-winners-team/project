import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const DictOrganizations = sequelize.define(
    'DictOrganizations',
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
      tableName: 'dict_organizations',
      timestamps: false,
    },
  );

  return DictOrganizations;
};
