const required = (value) => value !== undefined && value !== null && value !== "";

const registerValidator = (req) => {
  const fields = [
    "employeeId",
    "username",
    "fullName",
    "email",
    "phone",
    "designation",
    "password",
    "departmentId",
  ];
  return fields
    .filter((field) => !required(req.body[field]))
    .map((field) => `${field} is required`);
};

const loginValidator = (req) =>
  ["email", "password"]
    .filter((field) => !required(req.body[field]))
    .map((field) => `${field} is required`);

const otpValidator = (req) =>
  ["userId", "otpCode"]
    .filter((field) => !required(req.body[field]))
    .map((field) => `${field} is required`);

module.exports = { registerValidator, loginValidator, otpValidator };

