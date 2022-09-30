import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

const connection = new Pool({
    connectionString,
});

export { connection };