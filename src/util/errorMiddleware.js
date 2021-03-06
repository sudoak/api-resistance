const HttpStatus = require('http-status-codes');

const { getStatusText } = HttpStatus;

const errorMiddleware = (err, req, res, _) => {
    console.log("here", err);
    let errorCode = err.status || err.statusCode || err.code || 500;

    console.log(errorCode)
    return res.status(errorCode).json({
        statusCode: errorCode,
        code: getStatusText(errorCode),
        message: err.message
    });
}

module.exports = errorMiddleware;