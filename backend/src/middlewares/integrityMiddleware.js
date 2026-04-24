const AppError = require("../utils/AppError");

const requireIntegrityReady = (req, _res, next) => {
  if (req.headers["x-skip-integrity"] === "true") {
    return next(new AppError("Integrity bypass is not permitted", 400));
  }
  return next();
};

module.exports = requireIntegrityReady;

