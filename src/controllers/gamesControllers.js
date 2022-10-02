import { status_code } from '../enums/status.js';
import { connection } from '../pg/database.js';
import { gamesSchema } from '../schemas/validationSchemas.js';

async function gamesPost(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        const validation = gamesSchema.validate({name, image, stockTotal, categoryId, pricePerDay}, {
            abortEarly: false,
        });

        if(validation.error) {
            res.status(status_code.bad_request).send({"message": "É necessário preencher todos os campos!"});
            return;
        }

        const idCategories = await connection.query("SELECT * fROM categories WHERE id = $1;", [categoryId]);

        if((idCategories.rowCount) === 0) {
            res.status(status_code.bad_request).send({"message": "Essa categoria não existe!"});
            return;
        }

        const existName = await connection.query("SELECT * FROM games WHERE name=($1);", [name]);

        if((existName.rows).length) {
            res.status(status_code.conflict).send({"message": "Esse jogo já existe, tente cadastrar com outro nome!"});
            return;
        }

        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`, [name, image, stockTotal, categoryId, pricePerDay]);

        res.sendStatus(status_code.created);
        return;
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

async function gamesGet(req, res) {
    try {
        const games = await connection.query('SELECT games.*, categories.name AS "categoryName" FROM games INNER JOIN categories ON games."categoryId"=categories.id;');

        console.log(games);
        res.send(games.rows);
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

export { gamesPost, gamesGet };