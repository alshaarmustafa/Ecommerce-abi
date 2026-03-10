const AppError = require("../../utils/AppError");


module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('this role is not authorized', 403));
        }
        next();
    }
}