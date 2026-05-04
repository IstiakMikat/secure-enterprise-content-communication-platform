const User = require("../../models/User");
const authService = require("../authService");

class UserAdminService {
  async listUsers() {
    const users = await User.find().populate("roleId departmentId").sort({ createdAt: -1 });
    return Promise.all(users.map((user) => authService.buildUserProfile(user)));
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
