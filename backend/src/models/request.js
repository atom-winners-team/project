import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Request = sequelize.define(
    'Request',
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
      type: {
        type: DataTypes.ENUM('inspection', 'repair'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('new', 'in_progress', 'waiting_parts', 'done', 'rejected'),
        allowNull: false,
        defaultValue: 'new',
      },
      priority_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      assignee_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      planned_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      snapshot_context: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: 'requests',
      timestamps: true,
    },
  );

  Request.associate = (models) => {
    Request.belongsTo(models.Equipment, { foreignKey: 'equipment_id' });
    Request.belongsTo(models.User, { as: 'author', foreignKey: 'author_id' });
    Request.belongsTo(models.User, { as: 'assignee', foreignKey: 'assignee_id' });
    Request.belongsTo(models.DictPriorities, { as: 'priority', foreignKey: 'priority_id' });
    Request.hasOne(models.IncidentEpisode, { foreignKey: 'request_id' });
  };

  return Request;
};
