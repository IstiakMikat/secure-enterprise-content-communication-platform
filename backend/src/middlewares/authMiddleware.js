const sessionService = require("../services/sessionService");
const AppError = require("../utils/AppError");

const parseCookieToken = (cookieHeader = "") => {
  if (!cookieHeader) {
    return null;
  }
  const tokenChunk = cookieHeader
    .split(";")
    .map((segment) => segment.trim())
    .find((segment) => segment.startsWith("sep_token="));
  if (!tokenChunk) {
    return null;
  }
  return decodeURIComponent(tokenChunk.split("=")[1] || "");
};

const authMiddleware = async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const [, bearerToken] = header.split(" ");
  const token = bearerToken || parseCookieToken(req.headers.cookie);

  if (!token) {
    return next(new AppError("Authorization token missing", 401));
  }

  const session = await sessionService.getSessionByToken(token);
  if (!session) {
    return next(new AppError("Session invalid or expired", 401));
  }

  const requestUserAgent = String(req.headers["user-agent"] || "");
  if (
    session.userAgent &&
    requestUserAgent &&
    session.userAgent !== requestUserAgent
  ) {
    await sessionService.revokeSession(token);
    return next(new AppError("Session validation failed", 401));
  }

  session.lastSeenAt = new Date();
  await session.save();

  const user = session.userId;
  req.auth = {
    token,
    sessionId: session._id,
    user: {
      id: user._id,
      role: user.roleId?.code || user.roleId,
      departmentId: user.departmentId?._id || user.departmentId,
      accountStatus: user.accountStatus,
    },
  };

  next();
};

module.exports = authMiddleware;

