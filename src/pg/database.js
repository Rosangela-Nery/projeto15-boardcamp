import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const host = 'localhost';
const port = 5432;
const user = 'postgres';
const password = '123456';
const database = 'boardcamp';

const connection = new Pool({
    connectionString,
    host,
    port,
    user,
    password,
    database,
});

export { connection };