const sessionService = require("../services/sessionService");
const AppError = require("../utils/AppError");

const authMiddleware = async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");

  if (!token) {
    return next(new AppError("Authorization token missing", 401));
  }

  const session = await sessionService.getSessionByToken(token);
  if (!session) {
    return next(new AppError("Session invalid or expired", 401));
  }

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

