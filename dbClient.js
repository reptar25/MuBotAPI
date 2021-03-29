const { Pool } = require('pg');
const dbConfig = require('./config/databaseConfig');

const client = new Pool({
    connectionString: dbConfig.url,
    ssl: { rejectUnauthorized: false }
});


module.exports = client;