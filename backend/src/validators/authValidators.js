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
  ];
  const errors = fields
    .filter((field) => !required(req.body[field]))
    .map((field) => `${field} is required`);

  if (!required(req.body.departmentId) && !required(req.body.department)) {
    errors.push("department or departmentId is required");
  }

  return errors;
};

const loginValidator = (req) =>
  ["email", "password"]
    .filter((field) => !required(req.body[field]))
    .map((field) => `${field} is required`);

const otpValidator = (req) =>
  ["userId", "otpCode"]
    .filter((field) => !required(req.body[field]))
    .map((field) => `${field} is required`);

const resendOtpValidator = (req) =>
  ["userId"]
    .filter((field) => !required(req.body[field]))
    .map((field) => `${field} is required`);

module.exports = { registerValidator, loginValidator, otpValidator, resendOtpValidator };
