const biometricValidator = (req) =>
  !req.body.image ? ["image is required"] : [];

module.exports = { biometricValidator };

