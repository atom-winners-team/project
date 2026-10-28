'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          username: 'duty1',
          fullName: 'Дежурный 1',
          role: 'duty',
          passwordHash: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'engineer1',
          fullName: 'Сервисный инженер 1',
          role: 'engineer',
          passwordHash: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'director1',
          fullName: 'Технический директор 1',
          role: 'director',
          passwordHash: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { username: ['duty1', 'engineer1', 'director1'] }, {});
  },
};
