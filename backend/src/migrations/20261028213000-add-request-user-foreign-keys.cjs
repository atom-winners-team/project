'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('requests', {
      fields: ['author_id'],
      type: 'foreign key',
      name: 'requests_author_id_fkey',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addConstraint('requests', {
      fields: ['assignee_id'],
      type: 'foreign key',
      name: 'requests_assignee_id_fkey',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('requests', 'requests_assignee_id_fkey');
    await queryInterface.removeConstraint('requests', 'requests_author_id_fkey');
  },
};
