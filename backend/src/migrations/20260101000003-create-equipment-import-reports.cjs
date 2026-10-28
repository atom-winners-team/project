'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equipment_import_reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      unmatchedCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      unmatchedMissingIdsCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      matchedCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      report: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('equipment_import_reports');
  },
};
