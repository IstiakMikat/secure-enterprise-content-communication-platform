const app = require("./app");
const env = require("./config/env");
const { connectDatabase } = require("./config/db");

const start = async () => {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`Backend listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start backend", error);
    process.exit(1);
  }
};

start();

