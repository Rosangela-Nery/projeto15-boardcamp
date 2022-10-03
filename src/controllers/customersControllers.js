import { status_code } from '../enums/status.js';
import { connection } from '../pg/database.js';
import { customersSchema } from '../schemas/validationSchemas.js';

async function customersPost(req, res) {

    const { name, phone, cpf, birthday } = req.body;

    try {

        const existCpf = await connection.query("SELECT * FROM customers WHERE cpf=($1);", [cpf]);

        if((existCpf.rows).length) {
            res.status(status_code.conflict).send({"message": "Esse CPF já está cadastrado!"});
            return;
        }

        await connection.query("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);", [name, phone, cpf, birthday]);

        res.sendStatus(status_code.created);
        return;
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

async function customersGet(req, res) {

    try {
        const customers = await connection.query('SELECT * FROM customers;');

        console.log(customers);
        res.send(customers.rows);
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

async function customersGetId(req, res) {
    const { id } = req.params;
    console.log("111111: ", id)

    try {
        const existId = await connection.query("SELECT * FROM customers WHERE id = ($1);", [id]);
        console.log("22222: ", existId)

        console.log("44444444: ", existId.rows)

        if(!(existId.rows).length) {
            res.status(status_code.not_found).send({'message': 'Usuário não encontrado!'})
            return;
        }

        const customers = await connection.query('SELECT * FROM customers WHERE id = $1;', [id]);

        console.log("333333: ", customers);
        res.send(customers.rows[0]);
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

async function customersPut(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    const { id } = req.params;

    try {
        const existCustomers = await connection.query("SELECT * FROM customers WHERE cpf=($1) AND id!=$2", [cpf, id]);

        if(existCustomers.rows.length) { 
            res.status(status_code.not_found).send({'message': 'Esse CPF já está cadastrado!'})
            return;
        }

        await connection.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = ${id};`, [name, phone, cpf, birthday]);

        res.sendStatus(status_code.ok);
        return;
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

export { customersPost, customersGet, customersGetId, customersPut };