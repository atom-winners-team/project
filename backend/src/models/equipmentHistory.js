import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const EquipmentHistory = sequelize.define(
    'EquipmentHistory',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      equipmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      loadingIdKey: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      loadingIdOriginal: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      raw: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      isUnmatched: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'equipment_history',
      timestamps: true,
    },
  );

  EquipmentHistory.associate = (models) => {
    EquipmentHistory.belongsTo(models.Equipment, { foreignKey: 'equipmentId' });
  };

  return EquipmentHistory;
};
