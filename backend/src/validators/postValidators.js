const createPostValidator = (req) =>
  ["title", "body", "category", "visibilityLevel"]
    .filter((field) => !req.body[field])
    .map((field) => `${field} is required`);

module.exports = { createPostValidator };

