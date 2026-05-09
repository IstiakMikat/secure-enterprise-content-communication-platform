const mongoose = require("mongoose");
const env = require("./src/config/env");
const { connectDatabase } = require("./src/config/db");
const User = require("./src/models/User");

const run = async () => {
  console.log("Connecting to MongoDB...");
  await connectDatabase();
  
  console.log("\n===========================================");
  console.log(" RAW ENCRYPTED USER DATA IN MONGODB");
  console.log("===========================================\n");

  // Fetch all users but we'll just show the raw Mongoose document to expose the ciphertexts
  const users = await User.find().limit(3).lean(); // lean() returns pure JSON, not mongoose documents

  for (const user of users) {
    console.log(`\n--- Raw Database Record for User ID: ${user._id} ---`);
    console.log(`Role ID: ${user.roleId}`);
    
    // Demonstrate Password Hashing (No plaintext password stored)
    console.log(`\n[SECURITY] Password Hash (Academic SHA-256): \n  ${user.passwordHash}`);
    console.log(`[SECURITY] Password Salt: \n  ${user.passwordSalt}`);

    // Demonstrate Encrypted Fields (RSA/ECC)
    console.log(`\n[SECURITY] Encrypted Email Field:`);
    console.log(JSON.stringify(user.email, null, 2));

    console.log(`\n[SECURITY] Encrypted Full Name Field:`);
    console.log(JSON.stringify(user.fullName, null, 2));
    
    console.log("\n---------------------------------------------------");
  }

  console.log("\nClosing connection...");
  process.exit(0);
};

run().catch(console.error);
