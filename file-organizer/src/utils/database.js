// database.js - MongoDB connection utility

import mongoose from "mongoose";
import chalk from "chalk";

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/midnight-magnolia";
    
    console.log(chalk.blue(`Connecting to MongoDB at ${mongoURI}...`));
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(chalk.green("MongoDB connected successfully!"));
    
    return mongoose.connection;
  } catch (error) {
    console.error(chalk.red(`Error connecting to MongoDB: ${error.message}`));
    process.exit(1);
  }
}

// Disconnect from MongoDB
export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log(chalk.blue("Disconnected from MongoDB"));
  } catch (error) {
    console.error(chalk.red(`Error disconnecting from MongoDB: ${error.message}`));
  }
}
