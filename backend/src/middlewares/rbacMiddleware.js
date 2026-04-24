const AppError = require("../utils/AppError");

const allowRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.auth.user.role)) {
    return next(new AppError("You do not have permission for this action", 403));
  }
  return next();
};

module.exports = allowRoles;

