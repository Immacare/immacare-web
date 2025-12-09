/**
 * MongoDB Configuration Module
 * 
 * PURPOSE:
 * This module handles the connection to MongoDB database for the Immacare application.
 * It provides a centralized way to manage database connections and connection events.
 * 
 * USAGE:
 * Import this module in server.js: const { connectMongoDB } = require('./config/mongodb');
 * Then call connectMongoDB() to establish the database connection.
 * 
 * CONFIGURATION:
 * - Connection string can be set via MONGODB_URI environment variable
 * - Defaults to X509 authenticated MongoDB Atlas connection
 * - Supports X509 authentication for MongoDB Atlas
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection string
// Priority: Uses MONGODB_URI from .env file if available, otherwise uses default connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://raraix1x6_db_user:hW6OCIWYwNPMErQS@cluster0.3cpesww.mongodb.net/immacare_db?appName=Cluster0';

/**
 * connectMongoDB
 * Purpose: Establish connection to MongoDB database
 * 
 * Process:
 *   1. Attempts to connect using the connection string
 *   2. Configures TLS options if certificate files are provided via environment variables
 *   3. Logs success or error messages
 *   4. Returns boolean indicating connection status
 * 
 * @returns {Promise<boolean>} True if connection successful, false otherwise
 */
const connectMongoDB = async () => {
  try {
    // Build connection options
    const connectionOptions = {};

    // If certificate files are provided via environment variables, add TLS options
    // This is optional - MongoDB Atlas may handle certificates automatically
    if (process.env.MONGODB_TLS_CERT_FILE && process.env.MONGODB_TLS_KEY_FILE) {
      const certPath = path.resolve(process.env.MONGODB_TLS_CERT_FILE);
      const keyPath = path.resolve(process.env.MONGODB_TLS_KEY_FILE);
      
      if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        connectionOptions.tls = true;
        connectionOptions.tlsCertificateKeyFile = certPath;
        
        // If CA file is provided, use it
        if (process.env.MONGODB_TLS_CA_FILE) {
          const caPath = path.resolve(process.env.MONGODB_TLS_CA_FILE);
          if (fs.existsSync(caPath)) {
            connectionOptions.tlsCAFile = caPath;
          }
        }
      }
    }

    await mongoose.connect(MONGODB_URI, connectionOptions);
    console.log('✅ Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Provide helpful guidance for common errors
    if (error.message.includes('whitelist') || error.message.includes('IP') || error.message.includes('MongoServerSelectionError')) {
      console.error('\n💡 SOLUTION: Your IP address needs to be whitelisted in MongoDB Atlas.');
      console.error('   1. Go to: https://cloud.mongodb.com/');
      console.error('   2. Navigate to: Network Access → IP Access List');
      console.error('   3. Click "Add IP Address"');
      console.error('   4. Click "Add Current IP Address" (or enter 0.0.0.0/0 to allow all IPs for development)');
      console.error('   5. Wait 1-2 minutes for changes to take effect');
      console.error('   6. Restart your server\n');
    }
    
    return false;
  }
};

// ============================================================================
// MONGODB CONNECTION EVENT HANDLERS
// ============================================================================
// These event handlers monitor the database connection status and log events

// Fired when Mongoose successfully connects to MongoDB
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

// Fired when there's an error with the MongoDB connection
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

// Fired when Mongoose disconnects from MongoDB
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// ============================================================================
// GRACEFUL SHUTDOWN HANDLER
// ============================================================================
// Handles application termination (Ctrl+C) by properly closing database connection
// This ensures data integrity and prevents connection leaks
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = { connectMongoDB, mongoose };

