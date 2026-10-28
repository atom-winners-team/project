import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const EquipmentImportReport = sequelize.define(
    'EquipmentImportReport',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      unmatchedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      unmatchedMissingIdsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      matchedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      report: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: 'equipment_import_reports',
      timestamps: true,
    },
  );

  return EquipmentImportReport;
};
