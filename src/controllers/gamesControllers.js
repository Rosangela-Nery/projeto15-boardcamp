import { status_code } from '../enums/status.js';
import { connection } from '../pg/database.js';

async function gamesPost(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        connection.query("INSERT INTO games (name, image, stockTotal, categoryId, pricePerDay ) VALUES ($1);", [name]);

        res.sendStatus(status_code.created);
        return;
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

async function gamesGet(req, res) {

}

export { gamesPost, gamesGet };