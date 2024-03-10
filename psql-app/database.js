const { Pool } = require('pg');
const pool = new Pool({
  max: 100,//aynı anda bu appin kaç tane connection açabileceğinin limiti
  host: 'localhost', // veya bir IP adresi 
  port: 5432,
  user: 'postgresql',
  password: '1234',
  database: 'postgres_db',
});

module.exports = pool;
