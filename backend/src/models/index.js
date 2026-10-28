import { Sequelize } from 'sequelize';
import { readRequiredString } from '../config/env.js';

import Equipment from './equipment.js';
import EquipmentHistory from './equipmentHistory.js';
import DictPriorities from './dictPriorities.js';
import DictRepairTypes from './dictRepairTypes.js';
import DictStates from './dictStates.js';
import DictOrganizations from './dictOrganizations.js';
import User from './user.js';
import Request from './request.js';
import TelemetrySignals from './telemetrySignals.js';
import IncidentEpisode from './incidentEpisode.js';

const sequelize = new Sequelize(
  readRequiredString('PG_DATABASE'),
  readRequiredString('PG_USER'),
  readRequiredString('PG_PASSWORD'),
  {
    host: readRequiredString('PG_HOST'),
    port: Number(process.env.PG_PORT ?? 5432),
    dialect: 'postgres',
    logging: false,
  },
);

const db = {
  Sequelize,
  sequelize,
};

db.Equipment = Equipment(sequelize);
db.EquipmentHistory = EquipmentHistory(sequelize);
db.DictPriorities = DictPriorities(sequelize);
db.DictRepairTypes = DictRepairTypes(sequelize);
db.DictStates = DictStates(sequelize);
db.DictOrganizations = DictOrganizations(sequelize);
db.User = User(sequelize);
db.Request = Request(sequelize);
db.TelemetrySignals = TelemetrySignals(sequelize);
db.IncidentEpisode = IncidentEpisode(sequelize);

for (const model of Object.values(db)) {
  if (model?.associate) {
    model.associate(db);
  }
}

export default db;