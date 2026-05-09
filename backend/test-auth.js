const mongoose = require("mongoose");
const env = require("./src/config/env");
const { connectDatabase } = require("./src/config/db");
const authService = require("./src/services/authService");

const run = async () => {
  await connectDatabase();
  console.log("Registering testuser@example.com...");
  try {
    const reg = await authService.register({
      employeeId: "EMP-TEST",
      username: "testuser",
      fullName: "Test User",
      email: "testuser@example.com",
      phone: "+123",
      designation: "Tester",
      password: "TestPassword123!",
      otpChannel: "email",
      roleCode: "USER"
    }, { ipAddress: "127.0.0.1", device: {} });
    console.log("Registered:", reg);
    
    console.log("Attempting to find user by email...");
    const matched = await authService.findUserByEmail("testuser@example.com");
    if (!matched) {
      console.log("FAILED to find user by email!");
    } else {
      console.log("Found user:", matched._id);
      
      console.log("Attempting to login...");
      const loginRes = await authService.login({
        email: "testuser@example.com",
        password: "TestPassword123!",
        otpChannel: "email"
      }, { ipAddress: "127.0.0.1", device: {} });
      console.log("Login successful:", loginRes);
    }
  } catch (err) {
    console.error("Error:", err);
  }

  process.exit(0);
};

run().catch(console.error);
