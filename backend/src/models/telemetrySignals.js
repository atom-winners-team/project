import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const TelemetrySignals = sequelize.define(
    'TelemetrySignals',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      equipment_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      signal_type: {
        type: DataTypes.ENUM('status', 'active_power', 'reactive_power', 'wind_speed', 'wind_direction', 'temperature'),
        allowNull: true,
      },
      raw_value: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      received_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_fresh: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'telemetry_signals',
      timestamps: true,
    },
  );

  TelemetrySignals.associate = (models) => {
    TelemetrySignals.belongsTo(models.Equipment, { foreignKey: 'equipment_id' });
  };

  return TelemetrySignals;
};
