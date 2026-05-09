const mongoose = require("mongoose");
const { connectDatabase } = require("./src/config/db");
const authService = require("./src/services/authService");

const run = async () => {
  await connectDatabase();
  console.log("Checking admin@enterprise.local...");
  try {
    const matched = await authService.findUserByEmail("admin@enterprise.local");
    if (!matched) {
      console.log("FAILED to find user by email!");
    } else {
      console.log("Attempting to login with Admin12345!...");
      const loginRes = await authService.login({
        email: "admin@enterprise.local",
        password: "Admin12345!",
        otpChannel: "email"
      }, { ipAddress: "127.0.0.1", device: {} });
      console.log("Login successful!", loginRes);
    }
  } catch (err) {
    console.error("Login failed with error:", err.message);
  }
  process.exit(0);
};

run().catch(console.error);
