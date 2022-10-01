import joi from 'joi';

const categoriesSchema = joi.object({
    name: joi.string().min(2).required(),
});

export {
    categoriesSchema
}