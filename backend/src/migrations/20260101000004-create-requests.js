'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('requests', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      equipment_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('inspection', 'repair'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('new', 'in_progress', 'waiting_parts', 'done', 'rejected'),
        allowNull: false,
        defaultValue: 'new',
      },
      priority_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      assignee_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      planned_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      snapshot_context: {
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
    await queryInterface.dropTable('requests');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_requests_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_requests_status";');
  },
};
