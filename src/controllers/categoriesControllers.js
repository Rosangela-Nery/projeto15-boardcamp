import { status_code } from '../enums/status.js';
import { connection } from '../pg/database.js';
import { categoriesSchema } from '../schemas/validationSchemas.js';

async function categoriesPost(req, res) {

    const { name } = req.body;

    try {

        const validation = categoriesSchema.validate({name}, {
            abortEarly: false,
        });
        console.log("Errrr: ", validation)
        if(validation.error) {
            res.status(status_code.bad_request).send({"message": "É necessário preencher todos os campos!"});
            return;
        }

        const existName = await connection.query("SELECT * FROM categories WHERE name=($1);", [name]);

        if((existName.rows).length) {
            res.status(status_code.conflict).send({"message": "Esse nome já está cadastrado!"});
            return;
        }

        await connection.query("INSERT INTO categories (name) VALUES ($1);", [name]);

        res.sendStatus(status_code.created);
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