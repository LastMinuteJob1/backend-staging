import Joi from "joi";

export const userSchema = Joi.object({
    fullname: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    // phone_number:  Joi.string().min(8).required(),
    password: Joi.string().min(8).required(),
    address:  Joi.string().min(10).required(),
    pronoun:  Joi.string().min(2).required(),
    city:  Joi.string().min(2).required(),
    postal_code:  Joi.number().required(),
    isGmail: Joi.bool().required()
});

export const jobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  location: Joi.string().required(),
  priority: Joi.number().required()
})