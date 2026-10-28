import { Sequelize } from 'sequelize';
import process from 'process';
import { createRequire } from 'module';
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

const require = createRequire(import.meta.url);
const configJson = require('../../config/config.json');

const env = process.env.NODE_ENV || 'development';
const config = configJson[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

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

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
