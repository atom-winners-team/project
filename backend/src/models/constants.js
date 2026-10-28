import { DataTypes } from "sequelize";

export const STATUSES = {
  new: "new",
  in_progress: "in_progress",
  waiting_parts: "waiting_parts",
  done: "done",
  rejected: "rejected",
};

export const STATUSES_ENUM = DataTypes.ENUM(...Object.values(STATUSES));

export const CREATION_TYPES = {
  inspection: "inspection",
  repair: "repair",
};

export const CREATION_TYPES_ENUM = DataTypes.ENUM(
  ...Object.values(CREATION_TYPES),
);

export const USER_ROLES = {
    duty: "duty",
    engineer: "engineer",
    director: "director",
};

export const USER_ROLES_ENUM = DataTypes.ENUM(...Object.values(USER_ROLES));