/**
 * Cleanup Old MongoDB Collections Script
 * 
 * PURPOSE:
 * This script removes old collections from MongoDB that don't match the current
 * system's expected collections. It helps clean up the database when migrating
 * to a new MongoDB account.
 * 
 * USAGE:
 * Run this script with: node scripts/cleanup_old_collections.js
 * 
 * WARNING:
 * This script will DELETE collections that are not in the expected list.
 * Make sure you have a backup before running this script.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { connectMongoDB } = require('../config/mongodb');

// Expected collections based on the current system models
const EXPECTED_COLLECTIONS = [
  'users_info',              // User model
  'doctors_profile',         // DoctorProfile model
  'patient_info',            // PatientProfile model
  'appointment_booking',     // Appointment model
  'doctor_recommendations',  // DoctorRecommendation model
  'inventory',               // Inventory model
  'inventory_category'       // InventoryCategory model
];

// MongoDB system collections that should never be deleted
const SYSTEM_COLLECTIONS = [
  'system.indexes',
  'system.profile',
  'system.users',
  'system.version'
];

/**
 * Main cleanup function
 */
async function cleanupOldCollections() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    const connected = await connectMongoDB();
    
    if (!connected) {
      console.error('❌ Failed to connect to MongoDB. Exiting...');
      process.exit(1);
    }

    // Get the database instance
    const db = mongoose.connection.db;
    
    // List all collections in the database
    console.log('\n📋 Fetching all collections from database...');
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    console.log(`\n📊 Found ${collectionNames.length} collections in database:`);
    collectionNames.forEach(name => console.log(`   - ${name}`));
    
    // Identify collections to delete (not in expected list and not system collections)
    const collectionsToDelete = collectionNames.filter(name => {
      const isExpected = EXPECTED_COLLECTIONS.includes(name);
      const isSystem = SYSTEM_COLLECTIONS.some(sys => name.startsWith('system.'));
      return !isExpected && !isSystem;
    });
    
    if (collectionsToDelete.length === 0) {
      console.log('\n✅ No old collections found. All collections match the expected schema.');
      await mongoose.connection.close();
      process.exit(0);
    }
    
    console.log(`\n⚠️  Found ${collectionsToDelete.length} collection(s) to delete:`);
    collectionsToDelete.forEach(name => console.log(`   - ${name}`));
    
    // Confirm deletion (in production, you might want to add a confirmation prompt)
    console.log('\n🗑️  Deleting old collections...');
    
    for (const collectionName of collectionsToDelete) {
      try {
        await db.collection(collectionName).drop();
        console.log(`   ✅ Deleted collection: ${collectionName}`);
      } catch (error) {
        console.error(`   ❌ Error deleting collection ${collectionName}:`, error.message);
      }
    }
    
    console.log('\n✅ Cleanup completed successfully!');
    console.log('\n📋 Remaining collections:');
    const remainingCollections = await db.listCollections().toArray();
    remainingCollections.forEach(col => console.log(`   - ${col.name}`));
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\n👋 MongoDB connection closed.');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error during cleanup:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the cleanup
console.log('🚀 Starting MongoDB collection cleanup...\n');
cleanupOldCollections();










