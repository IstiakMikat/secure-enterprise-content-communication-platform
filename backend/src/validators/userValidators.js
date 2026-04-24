const updateProfileValidator = (req) =>
  !req.body.fullName && !req.body.phone && !req.body.designation
    ? ["At least one profile field must be provided"]
    : [];

const changePasswordValidator = (req) =>
  ["currentPassword", "newPassword"]
    .filter((field) => !req.body[field])
    .map((field) => `${field} is required`);

module.exports = { updateProfileValidator, changePasswordValidator };

