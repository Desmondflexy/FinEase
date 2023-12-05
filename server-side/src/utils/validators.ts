import joi from "joi";
import { phoneNumberRegex } from "./constants";

export const options = {
  abortEarly: false,
  errors: { wrap: { label: "" } },
};

export const signup = joi.object().keys({
  first: joi.string().required(),
  last: joi.string().required(),
  email: joi.string().email().required(),
  username: joi.string().required(),
  phone: joi.string().required(),
  password: joi.string().min(6).required(),
  confirm: joi.string().valid(joi.ref('password')).required().messages({'any.only': 'Passwords do not match'}),
});

export const login = joi.object().keys({
  emailOrUsername: joi.string().required().trim(),
  password: joi.string().required(),
});

export const adminSignup = joi.object().keys({
  first: joi.string().required(),
  last: joi.string().required(),
  email: joi.string().email().required(),
  username: joi.string().required(),
  phone: joi.string().required(),
  password: joi.string().min(6).required(),
  confirm: joi.string().valid(joi.ref('password')).required().messages({'any.only': 'Passwords do not match'}),
  adminKey: joi.string().required()
});

export const transferFunds = joi.object().keys({
  acctNoOrUsername: joi.string().required(),
  amount: joi.number().min(1).required(),
});


export const rechargeAirtime = joi.object().keys({
  operatorId: joi.string().required(),
  phone: joi.string().required().regex(phoneNumberRegex).messages({'string.pattern.base': 'Invalid phone number'}),
  amount: joi.number().integer().min(1).required(),
});

export const buyData = joi.object().keys({
  operatorId: joi.string().required(),
  phone: joi.string().required().regex(phoneNumberRegex).messages({'string.pattern.base': 'Invalid phone number'}),
  dataPlanId: joi.string().required(),
});