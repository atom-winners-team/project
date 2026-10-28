import { Sequelize } from 'sequelize';
import { config } from '../config/index.js';

import Equipment from './equipment.js';
import EquipmentHistory from './equipmentHistory.js';
import EquipmentImportReport from './equipmentImportReport.js';
import DictPriorities from './dictPriorities.js';
import DictRepairTypes from './dictRepairTypes.js';
import DictStates from './dictStates.js';
import DictOrganizations from './dictOrganizations.js';
import User from './user.js';
import Request from './request.js';
import TelemetrySignals from './telemetrySignals.js';
import IncidentEpisode from './incidentEpisode.js';

const databaseConfig = config.database;
const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: databaseConfig.dialect,
    logging: false,
  },
);

const db = {
  Sequelize,
  sequelize,
};

db.Equipment = Equipment(sequelize);
db.EquipmentHistory = EquipmentHistory(sequelize);
db.EquipmentImportReport = EquipmentImportReport(sequelize);
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