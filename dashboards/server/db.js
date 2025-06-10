const { neon } = require('@neondatabase/serverless');
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const pool = neon(process.env.DB_URL);
module.exports = pool;