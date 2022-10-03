import joi from 'joi';

const categoriesSchema = joi.object({
    name: joi.string().min(2).required(),
});

const gamesSchema = joi.object({
    name: joi.string().min(2).required(),
    image: joi.string().uri().required(), 
    stockTotal: joi.number().greater(0).required(), 
    categoryId: joi.number().required(), 
    pricePerDay: joi.number().greater(0).required(),
});

const customersSchema = joi.object({
    name: joi.string().min(2).required(),
    phone: joi.string().pattern(/^[0-9]+$/).min(10).max(11).required(),
    cpf: joi.string().pattern(/^[0-9]+$/).length(11).required(),
    birthday: joi.date().required(),
});

const rentalsSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().min(1).required(),
});

export {
    categoriesSchema,
    gamesSchema,
    customersSchema,
    rentalsSchema
}