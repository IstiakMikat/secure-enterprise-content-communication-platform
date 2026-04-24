const User = require("../../models/User");

class UserAdminService {
  listUsers() {
    return User.find().populate("roleId departmentId").sort({ createdAt: -1 });
  }

  updateStatus(userId, accountStatus) {
    return User.findByIdAndUpdate(userId, { accountStatus }, { new: true });
  }

  updateRole(userId, roleId) {
    return User.findByIdAndUpdate(userId, { roleId }, { new: true });
  }

  updateDepartment(userId, departmentId) {
    return User.findByIdAndUpdate(userId, { departmentId }, { new: true });
  }
}

module.exports = new UserAdminService();

