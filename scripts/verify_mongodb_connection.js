/**
 * MongoDB Connection Verification Script
 * 
 * PURPOSE:
 * This script verifies which MongoDB connection string is being used
 * and confirms the connection to the database.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { connectMongoDB } = require('../config/mongodb');

// Get the connection string that will be used
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://immacare.xr6wcn1.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&appName=immacare';

async function verifyConnection() {
  console.log('🔍 MongoDB Connection Verification\n');
  console.log('='.repeat(60));
  
  // Show which connection string is being used
  if (process.env.MONGODB_URI) {
    console.log('📝 Using MONGODB_URI from .env file:');
    console.log(`   ${process.env.MONGODB_URI}`);
  } else {
    console.log('📝 Using default connection string from config:');
    console.log(`   ${MONGODB_URI}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n🔄 Attempting to connect...\n');
  
  try {
    const connected = await connectMongoDB();
    
    if (!connected) {
      console.error('❌ Failed to connect to MongoDB');
      process.exit(1);
    }
    
    // Get connection details
    const connection = mongoose.connection;
    const host = connection.host;
    const port = connection.port;
    const name = connection.name;
    const readyState = connection.readyState;
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Connection Details:');
    console.log('='.repeat(60));
    console.log(`   Host: ${host || 'N/A'}`);
    console.log(`   Port: ${port || 'N/A'}`);
    console.log(`   Database: ${name || 'N/A'}`);
    console.log(`   Ready State: ${readyState === 1 ? 'Connected' : readyState}`);
    console.log(`   Connection String: ${connection.client?.s?.url || MONGODB_URI}`);
    
    // Verify it's the correct cluster
    const connectionString = connection.client?.s?.url || MONGODB_URI;
    if (connectionString.includes('immacare.xr6wcn1.mongodb.net')) {
      console.log('\n✅ CONFIRMED: Connected to your new MongoDB account (immacare.xr6wcn1.mongodb.net)');
    } else {
      console.log('\n⚠️  WARNING: Connection string does not match expected new account');
      console.log(`   Expected: immacare.xr6wcn1.mongodb.net`);
      console.log(`   Found: ${connectionString}`);
    }
    
    // List collections to confirm database access
    console.log('\n' + '='.repeat(60));
    console.log('📋 Collections in database:');
    console.log('='.repeat(60));
    const db = connection.db;
    const collections = await db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Verification complete!');
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error during verification:', error.message);
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

verifyConnection();















