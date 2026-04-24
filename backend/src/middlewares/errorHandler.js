const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    details: error.details || null,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};

module.exports = errorHandler;

