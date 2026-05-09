const mongoose = require("mongoose");
const { connectDatabase } = require("./src/config/db");
const authService = require("./src/services/authService");

const run = async () => {
  await connectDatabase();
  console.log("Checking rudmila.rudaba@gmail.com...");
  const matched = await authService.findUserByEmail("rudmila.rudaba@gmail.com");
  if (!matched) {
    console.log("FAILED to find user by email!");
  } else {
    console.log("Found user:", matched._id);
  }
  process.exit(0);
};

run().catch(console.error);
