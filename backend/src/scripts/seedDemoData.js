const { connectDatabase } = require("../config/db");
const Role = require("../models/Role");
const Department = require("../models/Department");
const EmployeeAnalytics = require("../models/EmployeeAnalytics");
const DepartmentAnalytics = require("../models/DepartmentAnalytics");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Post = require("../models/Post");
const PostVersion = require("../models/PostVersion");
const CryptoKey = require("../models/CryptoKey");
const BiometricLog = require("../models/BiometricLog");
const { ROLES, DEPARTMENTS } = require("../constants");
const authService = require("../services/authService");
const cryptoService = require("../services/cryptoService");

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
  await User.deleteMany({});
  await EmployeeAnalytics.deleteMany({});
  await DepartmentAnalytics.deleteMany({});
  await Notification.deleteMany({});
  await Post.deleteMany({});
  await PostVersion.deleteMany({});
  await CryptoKey.deleteMany({});
  await BiometricLog.deleteMany({});

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

  const seededUsers = await User.find({
    _id: { $in: [admin.userId, manager.userId, user.userId] },
  }).populate("departmentId roleId");

  const [adminUser, managerUser, standardUser] = seededUsers;

  const seededPosts = await Promise.all([
    {
      authorId: adminUser._id,
      departmentId: departmentByName["IT Security"]._id,
      category: "Security Advisory",
      title: "Security key rotation advisory",
      body: "Updated enterprise key lifecycle review completed.",
      visibilityLevel: "INTERNAL",
      status: "APPROVED",
    },
    {
      authorId: managerUser._id,
      departmentId: departmentByName["Fraud Operations"]._id,
      category: "Fraud Alert",
      title: "Chargeback anomaly escalation",
      body: "Elevated fraud review initiated for regional chargeback spike.",
      visibilityLevel: "DEPARTMENT",
      status: "PENDING_APPROVAL",
    },
    {
      authorId: standardUser._id,
      departmentId: departmentByName["Compliance"]._id,
      category: "Compliance Notice",
      title: "Draft regulatory update",
      body: "Pending review summary for revised internal compliance wording.",
      visibilityLevel: "DEPARTMENT",
      status: "DRAFT",
    },
  ].map(async (seed) => {
    const title = await cryptoService.encryptField(seed.title, "ECC", "POST_CONTENT");
    const body = await cryptoService.encryptField(seed.body, "ECC", "POST_CONTENT");
    const integrityMac = await cryptoService.createRecordMac({
      title: title.ciphertext,
      body: body.ciphertext,
      category: seed.category,
      visibilityLevel: seed.visibilityLevel,
    });

    const post = await Post.create({
      ...seed,
      title,
      body,
      integrityMac,
      integrityStatus: "VERIFIED",
      currentVersion: 1,
    });

    await PostVersion.create({
      postId: post._id,
      versionNumber: 1,
      title,
      body,
      changeSummary: "Seeded version",
      editedBy: seed.authorId,
    });

    return post;
  }));

  await Notification.insertMany([
    {
      userId: adminUser._id,
      type: "SECURITY",
      title: "Seed environment initialized",
      message: "Demo admin environment is ready for dashboard review.",
      severity: "INFO",
    },
    {
      userId: managerUser._id,
      type: "APPROVAL",
      title: "Approval queue item assigned",
      message: "One pending fraud post requires department review.",
      severity: "WARN",
    },
    {
      userId: standardUser._id,
      type: "CONTENT",
      title: "Draft saved successfully",
      message: "Your compliance draft is available in the drafts workspace.",
      severity: "INFO",
    },
  ]);

  await BiometricLog.create({
    userId: adminUser._id,
    action: "ENROLL",
    result: "SUCCESS",
    confidenceScore: 1,
    device: { name: "Seeder", userAgent: "seed-script", platform: "node" },
    ipAddress: "127.0.0.1",
  });

  console.log("Seed data created successfully.");
  console.log("Demo accounts:");
  console.log("Admin: admin@enterprise.local / Admin12345!");
  console.log("Manager: manager@enterprise.local / Manager12345!");
  console.log("User: user@enterprise.local / User12345!");
  console.log(`Seeded posts: ${seededPosts.length}`);
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
