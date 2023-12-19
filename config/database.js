// const path = require('path');

// module.exports = ({ env }) => ({
//   connection: {
//    client: 'sqlite',
//     connection: {
//      filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
//     },
//     useNullAsDefault: true,
//  },
// });
module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "127.0.0.1"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "pinme"),//Name of database
      user: env("DATABASE_USERNAME", "postgres"),//Default username
      password: env("DATABASE_PASSWORD", "pinadminme"),//Password to your PostgreSQL database
      ssl: env.bool("DATABASE_SSL", false),
    },
  },
});
