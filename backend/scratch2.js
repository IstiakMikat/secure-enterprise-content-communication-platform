const mongoose = require("mongoose");
const env = require("./src/config/env");
const { connectDatabase } = require("./src/config/db");
const User = require("./src/models/User");
const authService = require("./src/services/authService");

const run = async () => {
  await connectDatabase();
  const users = await User.find().populate("roleId departmentId");
  for (const user of users) {
    const profile = await authService.buildUserProfile(user);
    console.log(`ID: ${user._id}, Decrypted Email: ${profile.email}, FullName: ${profile.fullName}, Role: ${profile.role}`);
  }
  process.exit(0);
};

run().catch(console.error);
