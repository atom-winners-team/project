'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('requests', 'equipment_ref_id', {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'equipment',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.createTable('telemetry_signals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      equipment_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'equipment',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      signal_type: {
        allowNull: false,
        type: Sequelize.ENUM(
          'status',
          'active_power',
          'reactive_power',
          'wind_speed',
          'wind_direction',
          'temperature',
        ),
      },
      raw_value: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      unit: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      received_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      is_fresh: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

    await queryInterface.createTable('incident_episodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      equipment_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'equipment',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      started_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      resolved_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      request_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'requests',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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

    await queryInterface.addIndex('incident_episodes', ['equipment_id'], {
      name: 'incident_episodes_one_open_per_equipment',
      unique: true,
      where: { resolved_at: null },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('incident_episodes');
    await queryInterface.dropTable('telemetry_signals');
    await queryInterface.removeColumn('requests', 'equipment_ref_id');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_telemetry_signals_signal_type";',
    );
  },
};