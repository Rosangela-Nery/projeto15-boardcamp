import { status_code } from '../enums/status.js';
import { connection } from '../pg/database.js';

async function categoriesGet(req, res) {

    try {
        const categories = await connection.query('SELECT * FROM categories;');

        console.log(categories.rows);
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }

    res.send(status_code.ok);
}

export { categoriesGet };