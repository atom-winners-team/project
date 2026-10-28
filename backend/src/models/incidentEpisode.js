import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const IncidentEpisode = sequelize.define(
    'IncidentEpisode',
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
      started_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      resolved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      request_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      tableName: 'incident_episodes',
      timestamps: true,
    },
  );

  IncidentEpisode.associate = (models) => {
    IncidentEpisode.belongsTo(models.Equipment, { foreignKey: 'equipment_id' });
    IncidentEpisode.belongsTo(models.Request, { foreignKey: 'request_id' });
  };

  return IncidentEpisode;
};
