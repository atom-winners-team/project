module.exports = {
  development: {
    username: process.env.PG_USER || 'postgres12',
    password: process.env.PG_PASSWORD || 'postgres12',
    database: process.env.PG_DATABASE || 'owr_db',
    host: process.env.PG_HOST || '127.0.0.1',
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
  },
  test: {
    username: process.env.PG_USER || 'postgres12',
    password: process.env.PG_PASSWORD || 'postgres12',
    database: process.env.PG_DATABASE || 'owr_db_test',
    host: process.env.PG_HOST || '127.0.0.1',
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
  },
  production: {
    username: process.env.PG_USER || 'postgres12',
    password: process.env.PG_PASSWORD || 'postgres12',
    database: process.env.PG_DATABASE || 'owr_db',
    host: process.env.PG_HOST || 'db',
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
  },
};
