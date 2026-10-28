import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Equipment = sequelize.define(
    'Equipment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      external_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parent_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      equipment_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      level_name: {
        type: DataTypes.STRING,
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
      usage_life_months: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      inventory_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telemetry_key: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'equipment',
      timestamps: true,
    },
  );

  Equipment.associate = (models) => {
    Equipment.belongsTo(models.Equipment, { as: 'parent', foreignKey: 'parent_id' });
    Equipment.hasMany(models.Equipment, { as: 'children', foreignKey: 'parent_id' });
    Equipment.hasMany(models.EquipmentHistory, { foreignKey: 'equipment_id' });
  };

  return Equipment;
};
