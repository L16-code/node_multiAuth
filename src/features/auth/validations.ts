import Joi from "joi";
import { PASSWORD_REGEX } from "../../utils/commonConstants";

export const registerSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required().regex(PASSWORD_REGEX).messages({ 'string.pattern.base': `min 8 words, 1 uppercase , 1 lowercase, 1 special Char` }),
})
export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().regex(PASSWORD_REGEX).messages({ 'string.pattern.base': `min 8 words, 1 uppercase , 1 lowercase, 1 special Char` }).required()
})
export const updateProfileSchema= Joi.object({
    username: Joi.string().required()
})
export const querySchema= Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    filter: Joi.string().allow('').default(''),
});