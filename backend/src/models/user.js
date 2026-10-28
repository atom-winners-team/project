import { DataTypes } from 'sequelize';
import { USER_ROLES_ENUM } from "./constants.js";

export default (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'username',
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'passwordHash',
      },
      role: {
        type: USER_ROLES_ENUM,
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
    },
  );

  return User;
};
