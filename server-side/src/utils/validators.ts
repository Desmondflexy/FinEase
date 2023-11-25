import joi from "joi";

export const options = {
  abortEarly: false,
  errors: { wrap: { label: "" } },
};

export const signup = joi.object().keys({
  first: joi.string().required(),
  last: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.string().required(),
  password: joi.string().min(6).required(),
  confirm: joi.string().valid(joi.ref('password')).required(),
});

export const login = joi.object().keys({
  email: joi.string().email().required().trim(),
  password: joi.string().required(),
});

export const adminSignup = joi.object().keys({
  first: joi.string().required(),
  last: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.string().required(),
  password: joi.string().min(6).required(),
  confirm: joi.string().valid(joi.ref('password')).required(),
  adminKey: joi.string().required()
});