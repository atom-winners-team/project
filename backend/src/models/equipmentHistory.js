import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const EquipmentHistory = sequelize.define(
    'EquipmentHistory',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      equipment_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      external_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      downtime_reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      work_performed: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      work_end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      is_mapped: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'equipment_history',
      timestamps: true,
    },
  );

  EquipmentHistory.associate = (models) => {
    EquipmentHistory.belongsTo(models.Equipment, { foreignKey: 'equipment_id' });
  };

  return EquipmentHistory;
};
