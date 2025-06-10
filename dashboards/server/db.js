const { neon } = require('@neondatabase/serverless');
const pool = neon(process.env.DB_URL);
module.exports = pool;