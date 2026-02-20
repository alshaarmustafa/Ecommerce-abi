const { stack } = require("../routes/categoryRoute");

globalErrorHandling = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    res.status(statusCode).json({
        status,
        message: err?.message || "internal Server error ",
        error: process.env.NODE_ENV === 'development' ? err : undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })

};
module.exports = globalErrorHandling;