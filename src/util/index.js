const mongoose = require('mongoose');
const createError  = require('http-errors');
const { validationResult } = require('express-validator');


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

const customDetection = req => {
  var ipAddress
 
  ipAddress = req.connection.remoteAddress.replace(/\//g, '.')
 
  return ipAddress
}

module.exports = {
    errorHandler,
    isValidMongoId,
    validate,
    customDetection
}