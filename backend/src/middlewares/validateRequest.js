const AppError = require("../utils/AppError");

const validateRequest = (schema) => (req, _res, next) => {
  const errors = schema(req);
  if (errors.length) {
    return next(new AppError("Validation failed", 422, errors));
  }
  return next();
};

module.exports = validateRequest;

