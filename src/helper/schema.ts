import Joi from "joi";

export const userSchema = Joi.object({
    fullname: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    phone_number:  Joi.string().min(8).required(),
    password: Joi.string().min(8).required(),
    address:  Joi.string().min(10).required(),
    isGmail: Joi.bool().required()
  });