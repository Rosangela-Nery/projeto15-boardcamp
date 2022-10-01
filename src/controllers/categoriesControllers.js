import { status_code } from '../enums/status.js';
import { connection } from '../pg/database.js';
import { categoriesSchema } from '../schemas/validationSchemas.js';

async function categoriesPost(req, res) {

    const { name } = req.body;

    const validation = categoriesSchema.validate(name , {
        abortEarly: false,
    });

    if(validation.error) {
        res.status(status_code.bad_request).send({"message": "É necessário preencher todos os campos!"});
        return;
    }

    try {
        connection.query("INSERT INTO categories (name) VALUES ($1);", [name]);

        res.send(status_code.created);
        return;
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

async function categoriesGet(req, res) {

    try {
        const categories = await connection.query('SELECT * FROM categories;');

        console.log(categories);
        res.send(categories.rows);
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

export { categoriesGet, categoriesPost };