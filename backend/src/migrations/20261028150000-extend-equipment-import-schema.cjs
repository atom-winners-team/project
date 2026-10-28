'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dict_organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
    });

    await queryInterface.createTable('dict_priorities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
    });

    await queryInterface.createTable('dict_states', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
    });

    await queryInterface.createTable('dict_repair_types', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });

    await queryInterface.createTable('dict_import_values', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dict_group: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      value: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
    });
    await queryInterface.addIndex('dict_import_values', ['dict_group', 'value'], {
      unique: true,
      name: 'dict_import_values_group_value_unique',
    });

    await queryInterface.createTable('equipment_hierarchy_nodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      parent_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'equipment_hierarchy_nodes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      level: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      raw_row: {
        allowNull: true,
        type: Sequelize.JSONB,
      },
      source_file: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      source_row_number: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    const equipmentColumns = {
      hierarchy_node_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'equipment_hierarchy_nodes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      work_schedule_dict_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'dict_import_values', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      typical_repair_code: { allowNull: true, type: Sequelize.TEXT },
      commissioned_at: { allowNull: true, type: Sequelize.DATEONLY },
      manufactured_at: { allowNull: true, type: Sequelize.DATEONLY },
      useful_life_months: { allowNull: true, type: Sequelize.DECIMAL },
      inventory_number: { allowNull: true, type: Sequelize.TEXT },
      comment: { allowNull: true, type: Sequelize.TEXT },
    };

    for (const [name, definition] of Object.entries(equipmentColumns)) {
      await queryInterface.addColumn('equipment', name, definition);
    }

    const historyColumns = {
      state_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'dict_states', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      downtime_reason: { allowNull: true, type: Sequelize.TEXT },
      repair_work_name: { allowNull: true, type: Sequelize.TEXT },
      repair_type_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'dict_repair_types', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      repair_completed_at: { allowNull: true, type: Sequelize.DATEONLY },
      workload_parameter: { allowNull: true, type: Sequelize.TEXT },
      workload_unit: { allowNull: true, type: Sequelize.TEXT },
      planned_workload: { allowNull: true, type: Sequelize.DECIMAL },
      planned_workload_period: { allowNull: true, type: Sequelize.TEXT },
      workload_period_duration: { allowNull: true, type: Sequelize.TEXT },
      workload_from: { allowNull: true, type: Sequelize.DATEONLY },
      workload_to: { allowNull: true, type: Sequelize.DATEONLY },
      workload_value: { allowNull: true, type: Sequelize.DECIMAL },
      controlled_indicator: { allowNull: true, type: Sequelize.TEXT },
      controlled_indicator_unit: { allowNull: true, type: Sequelize.TEXT },
      control_date: { allowNull: true, type: Sequelize.DATEONLY },
      controlled_value: { allowNull: true, type: Sequelize.DECIMAL },
      source_file: { allowNull: true, type: Sequelize.TEXT },
      source_sheet: { allowNull: true, type: Sequelize.TEXT },
      source_row_number: { allowNull: true, type: Sequelize.INTEGER },
    };

    for (const [name, definition] of Object.entries(historyColumns)) {
      await queryInterface.addColumn('equipment_history', name, definition);
    }
    await queryInterface.addIndex(
      'equipment_history',
      ['source_file', 'source_sheet', 'source_row_number'],
      {
        unique: true,
        name: 'equipment_history_source_row_unique',
      },
    );

    await queryInterface.addColumn('equipment_import_reports', 'source_file', {
      allowNull: true,
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn(
      'equipment_import_reports',
      'source_sha256',
      {
        allowNull: true,
        type: Sequelize.STRING(64),
      },
    );
    await queryInterface.addIndex(
      'equipment_import_reports',
      ['source_sha256'],
      {
        unique: true,
        name: 'equipment_import_reports_source_sha256_unique',
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'equipment_import_reports',
      'equipment_import_reports_source_sha256_unique',
    );
    await queryInterface.removeColumn(
      'equipment_import_reports',
      'source_sha256',
    );
    await queryInterface.removeColumn('equipment_import_reports', 'source_file');

    await queryInterface.removeIndex(
      'equipment_history',
      'equipment_history_source_row_unique',
    );
    for (const name of [
      'state_id',
      'downtime_reason',
      'repair_work_name',
      'repair_type_id',
      'repair_completed_at',
      'workload_parameter',
      'workload_unit',
      'planned_workload',
      'planned_workload_period',
      'workload_period_duration',
      'workload_from',
      'workload_to',
      'workload_value',
      'controlled_indicator',
      'controlled_indicator_unit',
      'control_date',
      'controlled_value',
      'source_file',
      'source_sheet',
      'source_row_number',
    ]) {
      await queryInterface.removeColumn('equipment_history', name);
    }

    for (const name of [
      'hierarchy_node_id',
      'work_schedule_dict_id',
      'typical_repair_code',
      'commissioned_at',
      'manufactured_at',
      'useful_life_months',
      'inventory_number',
      'comment',
    ]) {
      await queryInterface.removeColumn('equipment', name);
    }

    await queryInterface.dropTable('equipment_hierarchy_nodes');
    await queryInterface.removeIndex(
      'dict_import_values',
      'dict_import_values_group_value_unique',
    );
    await queryInterface.dropTable('dict_import_values');
    await queryInterface.dropTable('dict_repair_types');
    await queryInterface.dropTable('dict_states');
    await queryInterface.dropTable('dict_priorities');
    await queryInterface.dropTable('dict_organizations');
  },
};
