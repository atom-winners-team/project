"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_users_role" RENAME VALUE 'duty_officer' TO 'duty'`,
    );
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_users_role" RENAME VALUE 'service_engineer' TO 'engineer'`,
    );
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_users_role" RENAME VALUE 'technical_director' TO 'director'`,
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_users_role" RENAME VALUE 'duty' TO 'duty_officer'`,
    );
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_users_role" RENAME VALUE 'engineer' TO 'service_engineer'`,
    );
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_users_role" RENAME VALUE 'director' TO 'technical_director'`,
    );
  },
};
