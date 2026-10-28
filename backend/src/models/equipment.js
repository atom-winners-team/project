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
