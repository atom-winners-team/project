'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equipment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      loadingId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      loadingIdOriginal: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      attributes: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      rawRow: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      isContextOnly: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('equipment');
  },
};
