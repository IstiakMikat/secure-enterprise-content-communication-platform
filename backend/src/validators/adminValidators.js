const keyGenerateValidator = (req) =>
  ["name", "algorithm", "purpose"]
    .filter((field) => !req.body[field])
    .map((field) => `${field} is required`);

module.exports = { keyGenerateValidator };

