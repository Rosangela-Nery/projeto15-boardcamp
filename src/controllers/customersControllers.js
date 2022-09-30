import { status_code } from '../enums/status.js';
import { connection } from '../pg/database.js';

async function customersGet(req, res) {
    const { id } = req.params;

    if(!id) {
        res.status(status_code.not_found).send({'message': 'Usuário não encontrado!'})
    }

    try {
        const customers = await connection.query('SELECT * FROM customers WHERE id = $1;', [id]);

        console.log(customers);
        res.send(customers.rows[0]);
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

export { customersGet };