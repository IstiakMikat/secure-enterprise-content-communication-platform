const required = (value) => value !== undefined && value !== null && value !== "";

const registerValidator = (req) => {
  const fields = [
    "email",
    "password",
  ];
  const errors = fields
    .filter((field) => !required(req.body[field]))
    .map((field) => `${field} is required`);

  // Optional fields - will use defaults if not provided
  const optionalFields = ["fullName", "username", "employeeId", "phone", "designation"];
  
  // Validate email format
  const email = String(req.body.email || "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("email must be a valid email address");
  }

  // Validate password strength
  const password = String(req.body.password || "");
  if (password && password.length < 6) {
    errors.push("password must be at least 6 characters long");
  }

  return errors;
};

const loginValidator = (req) =>
  ["email", "password"]
    .filter((field) => !required(req.body[field]))
    .map((field) => `${field} is required`);

const otpValidator = (req) => {
  const errors = ["userId", "otpCode"]
    .filter((field) => !required(req.body[field]))
    .map((field) => `${field} is required`);

  const otpCode = String(req.body.otpCode || "").trim();
  if (otpCode && !/^\d{6}$/.test(otpCode)) {
    errors.push("otpCode must be a 6-digit numeric code");
  }

  return errors;
};

const resendOtpValidator = (req) =>
  ["userId"]
    .filter((field) => !required(req.body[field]))
    .map((field) => `${field} is required`);

module.exports = { registerValidator, loginValidator, otpValidator, resendOtpValidator };
