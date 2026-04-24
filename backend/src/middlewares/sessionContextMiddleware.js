const buildRequestContext = (req, _res, next) => {
  req.requestContext = {
    ipAddress:
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress,
    userAgent: req.headers["user-agent"] || "unknown",
    device: {
      name: req.headers["x-device-name"] || "Browser Session",
      userAgent: req.headers["user-agent"] || "unknown",
      ipAddress:
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket.remoteAddress,
      platform: req.headers["sec-ch-ua-platform"] || "unknown",
    },
  };
  next();
};

module.exports = buildRequestContext;

