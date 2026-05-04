const mongoose = require('mongoose');

const uri = 'mongodb://mikat7b:Mikat007@ac-eblagwy-shard-00-00.0swp6h9.mongodb.net:27017,ac-eblagwy-shard-00-01.0swp6h9.mongodb.net:27017,ac-eblagwy-shard-00-02.0swp6h9.mongodb.net:27017/?ssl=true&replicaSet=atlas-lui4f8-shard-0&authSource=admin&appName=Cluster0';

async function testConnection() {
  try {
    await mongoose.connect(uri);
    console.log('Connected successfully to MongoDB Atlas');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

testConnection();