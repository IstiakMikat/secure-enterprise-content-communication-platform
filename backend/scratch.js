const mongoose = require("mongoose");
const env = require("./src/config/env");
const { connectDatabase } = require("./src/config/db");
const authService = require("./src/services/authService");

const run = async () => {
  await connectDatabase();
  console.log("Checking admin@enterprise.local:");
  const admin = await authService.findUserByEmail("admin@enterprise.local");
  console.log(admin ? "Found: " + admin.email.ciphertext : "Not found");
  
  const profile = await authService.buildUserProfile(admin);
  console.log("Profile:", profile);
  
  process.exit(0);
};

run().catch(console.error);
