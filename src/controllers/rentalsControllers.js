import { status_code } from '../enums/status.js';
import { connection } from '../pg/database.js';
import { rentalsSchema } from '../schemas/validationSchemas.js';
import dayjs from "dayjs";

async function rentalsPost(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const validation = rentalsSchema.validate({customerId, gameId, daysRented}, {
            abortEarly: false,
        });

        if(validation.error) {
            res.status(status_code.bad_request).send({"message": "É necessário preencher todos os campos!"});
            return;
        }

        const existCustomerId = await connection.query(`SELECT * FROM customers WHERE "id" = ($1);`, [customerId]);

        if(!(existCustomerId.rows).length) {
            res.status(status_code.bad_request).send({"message": "Cliente não cadastrado!"});
            return;
        }

        const existGameId = await connection.query(`SELECT * FROM games WHERE "id" = ($1);`, [gameId]);

        if(!(existGameId.rows).length) {
            res.status(status_code.bad_request).send({"message": "Jogo não cadastrado!"});
            return;
        }

        if(daysRented <= 0) {
            res.status(status_code.bad_request).send({"message": "DaysRented deve ser maior que 0!"});
            return;
        }

        const date = dayjs().format("YYYY-MM-DD");

        const value = (existGameId.rows[0].pricePerDay) * daysRented;

        await connection.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") VALUES ($1, $2, $3, $4, $5);`, [customerId, gameId, date, daysRented,  value])

        res.sendStatus(status_code.created);
        return;
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

async function rentalsGet(req, res) {

    const customerId = req.query.customerId;
    const gameId = req.query.gameId;

    try {
        let rentals;

        if(customerId) {
            rentals = await connection.query(`SELECT rentals.*, json_build_object('id', customers.id,
            'name', customers.name) AS customer,
            json_build_object(
            'id', games.id,
            'name', games.name,
            'categoryId', games."categoryId",
            'categoryName', categories.name) 
            AS game FROM rentals JOIN customers ON customers.id = rentals."customerId" JOIN games ON rentals."gameId" = games.id JOIN categories ON categories.id = games."categoryId" WHERE "customerId" = $1;`, [customerId]);
        }

        if(gameId) {
            rentals = await connection.query(`SELECT rentals.*, json_build_object('id', customers.id,
            'name', customers.name) AS customer,
            json_build_object(
             'id', games.id,
             'name', games.name,
             'categoryId', games."categoryId",
             'categoryName', categories.name) 
             AS game FROM rentals JOIN customers ON customers.id = rentals."customerId" JOIN games ON rentals."gameId" = games.id JOIN categories ON categories.id = games."categoryId" WHERE "gameId" = $1;`, [gameId])
        }

        if(!customerId && !gameId) {
            rentals = await connection.query(`SELECT rentals.*, json_build_object('id', customers.id,
            'name', customers.name) AS customer,
            json_build_object(
            'id', games.id,
            'name', games.name,
            'categoryId', games."categoryId",
            'categoryName', categories.name) 
            AS game FROM rentals JOIN customers ON customers.id = rentals."customerId" JOIN games ON rentals."gameId" = games.id JOIN categories ON categories.id = games."categoryId";`)
        }

        res.send(rentals.rows);
        return;
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

async function rentalsPostReturn(req, res) {
    const { id } = req.params;
    const date = dayjs().format("YYYY-MM-DD");
    let days = 0;
    const delayFee = null;

    try {
        const rentalsId = await connection.query("SELECT * FROM rentals WHERE id = ($1);", [id]);

        if(!(rentalsId.rows).length) {
            res.status(status_code.not_found).send({'message': 'Aluguel não encontrado!'})
            return;
        }

        const dateReturn = dayjs(rentalsId.rows[0].dateReturn).format("YYYY-MM-DD HH:mm");

        console.log("22222: ", dateReturn)

        let hours = dateReturn.diff(rentalsId, "hours");
        let day = Math.floor(hours / 24);
        hours = hours - day * 24;

        console.log("11111: ", hours)

        if(day - rentalsId.rows[0].daysRented > 0) {
            days = day - rentalsDelete.daysRented;
        }

        const idGames = await (await connection.query(`SELECT * FROM games WHERE id = ${rentalsId.gameId};`)).rows[0];

        const dayPrice = idGames.rows[0].pricePerDay;

        delayFee = days * dayPrice;

        await connection.query(`UPDATE rentals SET "returnDate" = '${date}', "delayFee" = ${delayFee} WHERE id = ${id};`);

        res.sendStatus(status_code.ok);
        return;
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

async function rentalsDelete(req, res) {
    const { id } = req.params;

    try {
        const rentals = await connection.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);

        if(!(rentals.rows).length) {
            res.sendStatus(status_code.not_found);
            return;
        }

        if(rentals.returnDate === null) {
            res.sendStatus(status_code.bad_request);
            return;
        }

        await connection.query(`DELETE FROM rentals WHERE id = $1;`, [id]);

        res.sendStatus(status_code.ok);
        return;
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

export { rentalsPost, rentalsGet, rentalsPostReturn, rentalsDelete}