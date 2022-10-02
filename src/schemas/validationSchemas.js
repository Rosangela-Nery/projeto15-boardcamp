import joi from 'joi';

const categoriesSchema = joi.object({
    name: joi.string().min(2).required(),
});

const gamesSchema =joi.object({
    name: joi.string().min(2).required(),
    image: joi.string().uri().required(), 
    stockTotal: joi.number().greater(0).required(), 
    categoryId: joi.number().required(), 
    pricePerDay: joi.number().greater(0).required(),
});

export {
    categoriesSchema,
    gamesSchema
}