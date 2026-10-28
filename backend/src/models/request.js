import { DataTypes } from "sequelize";
import { STATUSES, STATUSES_ENUM, CREATION_TYPES_ENUM } from "./constants.js";

export default (sequelize) => {
  const Request = sequelize.define(
    "Request",
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
        type: CREATION_TYPES_ENUM,
        allowNull: false,
      },
      status: {
        type: STATUSES_ENUM,
        allowNull: false,
        defaultValue: STATUSES.new,
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
      close_comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "requests",
      timestamps: true,
    },
  );

  Request.associate = (models) => {
    Request.belongsTo(models.Equipment, { foreignKey: "equipment_id" });
    Request.belongsTo(models.User, { as: "author", foreignKey: "author_id" });
    Request.belongsTo(models.User, {
      as: "assignee",
      foreignKey: "assignee_id",
    });
    Request.belongsTo(models.DictPriorities, {
      as: "priority",
      foreignKey: "priority_id",
    });
    Request.hasOne(models.IncidentEpisode, { foreignKey: "request_id" });
  };

  return Request;
};
