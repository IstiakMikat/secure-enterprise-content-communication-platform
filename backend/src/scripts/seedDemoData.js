const { connectDatabase } = require("../config/db");
const Role = require("../models/Role");
const Department = require("../models/Department");
const EmployeeAnalytics = require("../models/EmployeeAnalytics");
const DepartmentAnalytics = require("../models/DepartmentAnalytics");
const User = require("../models/User");
const { ROLES, DEPARTMENTS } = require("../constants");
const authService = require("../services/authService");

const roles = [
  {
    name: "Administrator",
    code: ROLES.ADMIN,
    description: "Full enterprise security and operations control",
    permissions: ["*"],
  },
  {
    name: "Manager",
    code: ROLES.MANAGER,
    description: "Department-level review and analytics access",
    permissions: ["approvals.manage", "analytics.department.read"],
  },
  {
    name: "User",
    code: ROLES.USER,
    description: "Standard employee workspace",
    permissions: ["posts.create", "posts.read.own", "profile.manage"],
  },
];

const run = async () => {
  await connectDatabase();

  await Role.deleteMany({});
  await Department.deleteMany({});

  const createdRoles = await Role.insertMany(roles);
  const departments = await Department.insertMany(
    DEPARTMENTS.map((name) => ({
      name,
      code: name.toUpperCase().replace(/\s+/g, "_"),
      description: `${name} department`,
    }))
  );

  const departmentByName = Object.fromEntries(
    departments.map((department) => [department.name, department])
  );

  const context = {
    ipAddress: "127.0.0.1",
    device: { name: "Seeder", userAgent: "seed-script", platform: "node" },
    userAgent: "seed-script",
  };

  const admin = await authService.register(
    {
      employeeId: "EMP-1001",
      username: "admin.secure",
      fullName: "Amina Rahman",
      email: "admin@enterprise.local",
      phone: "+8801700000001",
      designation: "Chief Security Administrator",
      password: "Admin12345!",
      departmentId: departmentByName["IT Security"]._id,
      roleCode: ROLES.ADMIN,
    },
    context
  );

  const manager = await authService.register(
    {
      employeeId: "EMP-2001",
      username: "manager.ops",
      fullName: "Fahim Chowdhury",
      email: "manager@enterprise.local",
      phone: "+8801700000002",
      designation: "Operations Manager",
      password: "Manager12345!",
      departmentId: departmentByName["Fraud Operations"]._id,
      roleCode: ROLES.MANAGER,
    },
    context
  );

  const user = await authService.register(
    {
      employeeId: "EMP-3001",
      username: "employee.user",
      fullName: "Nabila Sultana",
      email: "user@enterprise.local",
      phone: "+8801700000003",
      designation: "Compliance Analyst",
      password: "User12345!",
      departmentId: departmentByName["Compliance"]._id,
      roleCode: ROLES.USER,
    },
    context
  );

  await User.updateMany(
    { _id: { $in: [admin.userId, manager.userId, user.userId] } },
    { accountStatus: "ACTIVE" }
  );

  await EmployeeAnalytics.insertMany([
    { userId: admin.userId, postsCreated: 12, postsApproved: 9, loginCount: 30 },
    { userId: manager.userId, postsCreated: 21, postsApproved: 14, loginCount: 24 },
    { userId: user.userId, postsCreated: 8, postsRejected: 1, draftCount: 2, loginCount: 18 },
  ]);

  await DepartmentAnalytics.insertMany(
    departments.map((department, index) => ({
      departmentId: department._id,
      totalPosts: 10 + index * 3,
      approvedPosts: 6 + index * 2,
      pendingPosts: 2,
      rejectedPosts: 1,
      activeUsers: 4 + index,
      lastCalculatedAt: new Date(),
    }))
  );

  console.log("Seed data created successfully.");
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
