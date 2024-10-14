import joi from "joi";
import { phoneNumberRegex } from "./constants";

const options = {
    abortEarly: false,
    errors: { wrap: { label: "" } },
};

const signup = joi.object().keys({
    first: joi.string().required(),
    last: joi.string().required(),
    email: joi.string().email().required(),
    username: joi.string().required(),
    phone: joi.string().required().length(11),
    password: joi.string().min(6).required(),
    confirm: joi.string().valid(joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
});

const login = joi.object().keys({
    emailOrUsername: joi.string().required().trim(),
    password: joi.string().required(),
});

const adminSignup = joi.object().keys({
    first: joi.string().required(),
    last: joi.string().required(),
    email: joi.string().email().required(),
    username: joi.string().required(),
    phone: joi.string().required(),
    password: joi.string().min(6).required(),
    confirm: joi.string().valid(joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
    adminKey: joi.string().required()
});

const transferFunds = joi.object().keys({
    acctNoOrUsername: joi.string().required(),
    amount: joi.number().min(1).required(),
    password: joi.string().required()
});


const rechargeAirtime = joi.object().keys({
    operatorId: joi.string().required(),
    phone: joi.string().required().regex(phoneNumberRegex).messages({ 'string.pattern.base': 'Invalid phone number' }),
    amount: joi.number().integer().min(1).required(),
});

const buyData = joi.object().keys({
    operatorId: joi.string().required(),
    phone: joi.string().required().regex(phoneNumberRegex).messages({ 'string.pattern.base': 'Invalid phone number' }),
    dataPlanId: joi.string().required(),
});

const buyElectricity = joi.object().keys({
    amount: joi.number().integer().min(1).required(),
    operatorId: joi.string().required(),
    meterType: joi.string().required(),
    meterNumber: joi.string().required(),
})

const updateUser = joi.object().keys({
    first: joi.string().max(50),
    last: joi.string().max(50),
    email: joi.string().email(),
    phone: joi.string().regex(phoneNumberRegex).messages({ 'string.pattern.base': 'Invalid phone number' }),
    password: joi.string().min(6),
    confirm: joi.string().valid(joi.ref('password')).messages({ 'any.only': 'Passwords do not match' }),
    oldPassword: joi.string(),
});

const forgotPassword = joi.object().keys({
    email: joi.string().email().required().trim(),
});

const resetPassword = joi.object().keys({
    password: joi.string().min(6).required(),
    confirm: joi.string().valid(joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
});

class Validators {
    options = options;
    signup = signup;
    login = login;
    adminSignup = adminSignup;
    transferFunds = transferFunds;
    rechargeAirtime = rechargeAirtime;
    buyData = buyData;
    buyElectricity = buyElectricity;
    updateUser = updateUser;
    forgotPassword = forgotPassword;
    resetPassword = resetPassword;
}

const validators = new Validators();
export default validators;