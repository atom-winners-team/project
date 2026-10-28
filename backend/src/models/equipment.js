import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Equipment = sequelize.define(
    'Equipment',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      loadingId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      loadingIdOriginal: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      attributes: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      rawRow: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      isContextOnly: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hierarchy_node_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      work_schedule_dict_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      typical_repair_code: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      commissioned_at: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      manufactured_at: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      useful_life_months: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      inventory_number: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'equipment',
      timestamps: true,
    },
  );

  Equipment.associate = (models) => {
    Equipment.hasMany(models.EquipmentHistory, { foreignKey: 'equipmentId' });
  };

  return Equipment;
};
