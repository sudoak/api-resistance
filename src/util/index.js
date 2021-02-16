const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const createError  = require('http-errors');
const { validationResult } = require('express-validator');

const hashPassword =  async (password) => {
    const saltRounds = 10;
    return await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            if (err) reject(err)
            console.log(hash, password);
            resolve(hash)
        });
    });
}

const errorHandler = handler => async (req, res, next) => {
    try {
        return await handler(req, res, next);
    } catch (error) {
        return next(error);
    }
}


const isValidMongoId = id => {
    if(mongoose.isValidObjectId(id)){
        return true;
    } 
    throw createError(400, "Invalid User Id");
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(error => extractedErrors.push({ [error.param]: error.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

module.exports = {
    hashPassword,
    errorHandler,
    isValidMongoId,
    validate
}