const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;

const client = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});


module.exports = client;