const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  try {
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'secure-enterprise-platform'
      }
    });
    console.log(`MongoMemoryServer running on ${mongod.getUri()}`);
    // Keep process alive
    process.stdin.resume();
  } catch (error) {
    console.error("Failed to start memory server:", error);
  }
})();
