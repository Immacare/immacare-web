/**
 * Database Migration Script
 * 
 * PURPOSE:
 * Migrates data from old MongoDB database (with old collection names) to new MongoDB database
 * (with new collection names). This script connects to both databases and copies all data.
 * 
 * COLLECTION MAPPING:
 * - users_info → users
 * - appointment_booking → appointments
 * - doctors_profile → doctorprofiles
 * - patient_info → patients
 * - doctor_recommendations → doctorrecommendations
 * - inventory → inventories
 * - inventory_category → inventorycategories (or keep as is)
 * 
 * USAGE:
 * 1. Set OLD_MONGODB_URI in .env file (temporarily) or pass as environment variable
 * 2. Ensure NEW_MONGODB_URI is set in .env (your new X509 connection)
 * 3. Run: node scripts/migrate_to_new_database.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Old database connection (the one with old collection names)
const OLD_MONGODB_URI = process.env.OLD_MONGODB_URI || 'mongodb+srv://raijinjyn1_db_user:oU0KAxmow1QC8Z5P@immacare.nbppppb.mongodb.net/immacare_db?retryWrites=true&w=majority&appName=Immacare';

// New database connection (X509 authenticated or username/password)
// If you have username/password for the new database, set NEW_MONGODB_URI_USER_PASS in .env
// Otherwise, it will try X509 authentication
const NEW_MONGODB_URI = process.env.NEW_MONGODB_URI_USER_PASS || process.env.MONGODB_URI || 'mongodb+srv://immacare.xr6wcn1.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&appName=immacare';

// Collection name mapping
const COLLECTION_MAPPING = {
  'users_info': 'users',
  'appointment_booking': 'appointments',
  'doctors_profile': 'doctorprofiles',
  'patient_info': 'patients',
  'doctor_recommendations': 'doctorrecommendations',
  'inventory': 'inventories',
  'inventory_category': 'inventorycategories'
};

/**
 * Connect to a MongoDB database
 */
async function connectToDatabase(uri, label, isX509 = false) {
  try {
    let options = {};
    
    // If X509 authentication, configure TLS options
    if (isX509) {
      // Build connection options for X509
      if (process.env.MONGODB_TLS_CERT_FILE && process.env.MONGODB_TLS_KEY_FILE) {
        const certPath = path.resolve(process.env.MONGODB_TLS_CERT_FILE);
        const keyPath = path.resolve(process.env.MONGODB_TLS_KEY_FILE);
        
        if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
          options.tls = true;
          options.tlsCertificateKeyFile = certPath;
          
          // If CA file is provided, use it
          if (process.env.MONGODB_TLS_CA_FILE) {
            const caPath = path.resolve(process.env.MONGODB_TLS_CA_FILE);
            if (fs.existsSync(caPath)) {
              options.tlsCAFile = caPath;
            }
          }
        }
      }
      // For MongoDB Atlas X509, sometimes we need to allow invalid certificates during migration
      // or use system certificates. Try without explicit cert files first.
    }
    
    const conn = await mongoose.createConnection(uri, options).asPromise();
    console.log(`✅ Connected to ${label} database`);
    return conn;
  } catch (error) {
    console.error(`❌ Failed to connect to ${label} database:`, error.message);
    throw error;
  }
}

/**
 * Migrate a single collection
 */
async function migrateCollection(oldDb, newDb, oldCollectionName, newCollectionName) {
  try {
    console.log(`\n📦 Migrating ${oldCollectionName} → ${newCollectionName}...`);
    
    // Get all documents from old collection
    const oldCollection = oldDb.collection(oldCollectionName);
    const documents = await oldCollection.find({}).toArray();
    
    if (documents.length === 0) {
      console.log(`   ⚠️  No documents found in ${oldCollectionName}, skipping...`);
      return { migrated: 0, skipped: 0 };
    }
    
    console.log(`   📊 Found ${documents.length} document(s)`);
    
    // Insert into new collection
    const newCollection = newDb.collection(newCollectionName);
    
    // Check if collection already has data
    const existingCount = await newCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`   ⚠️  Collection ${newCollectionName} already has ${existingCount} document(s)`);
      console.log(`   🔄 Dropping existing collection to replace with migrated data...`);
      await newCollection.drop();
    }
    
    // Insert all documents
    if (documents.length > 0) {
      await newCollection.insertMany(documents);
    }
    
    console.log(`   ✅ Successfully migrated ${documents.length} document(s) to ${newCollectionName}`);
    return { migrated: documents.length, skipped: 0 };
    
  } catch (error) {
    console.error(`   ❌ Error migrating ${oldCollectionName}:`, error.message);
    return { migrated: 0, skipped: 1 };
  }
}

/**
 * Main migration function
 */
async function migrateDatabase() {
  let oldConnection = null;
  let newConnection = null;
  
  try {
    console.log('🚀 Starting Database Migration\n');
    console.log('='.repeat(60));
    console.log('📋 Collection Mapping:');
    Object.entries(COLLECTION_MAPPING).forEach(([old, newName]) => {
      console.log(`   ${old} → ${newName}`);
    });
    console.log('='.repeat(60));
    
    // Connect to old database
    console.log('\n🔄 Connecting to OLD database...');
    oldConnection = await connectToDatabase(OLD_MONGODB_URI, 'OLD');
    
    // Connect to new database
    // Check if using username/password or X509
    const isX509Auth = NEW_MONGODB_URI.includes('authMechanism=MONGODB-X509');
    const authType = isX509Auth ? 'X509 authentication' : 'username/password';
    console.log(`\n🔄 Connecting to NEW database (${authType})...`);
    newConnection = await connectToDatabase(NEW_MONGODB_URI, 'NEW', isX509Auth);
    
    // Get list of collections in old database
    const oldDb = oldConnection.db;
    const collections = await oldDb.listCollections().toArray();
    const oldCollectionNames = collections.map(col => col.name);
    
    console.log(`\n📊 Found ${oldCollectionNames.length} collection(s) in old database:`);
    oldCollectionNames.forEach(name => console.log(`   - ${name}`));
    
    // Migrate each collection
    let totalMigrated = 0;
    let totalSkipped = 0;
    const results = [];
    
    for (const [oldName, newName] of Object.entries(COLLECTION_MAPPING)) {
      if (oldCollectionNames.includes(oldName)) {
        const result = await migrateCollection(oldConnection.db, newConnection.db, oldName, newName);
        totalMigrated += result.migrated;
        totalSkipped += result.skipped;
        results.push({ oldName, newName, ...result });
      } else {
        console.log(`\n⚠️  Collection ${oldName} not found in old database, skipping...`);
        results.push({ oldName, newName, migrated: 0, skipped: 1 });
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    results.forEach(({ oldName, newName, migrated, skipped }) => {
      if (migrated > 0) {
        console.log(`   ✅ ${oldName} → ${newName}: ${migrated} document(s)`);
      } else if (skipped > 0) {
        console.log(`   ⚠️  ${oldName} → ${newName}: Skipped`);
      }
    });
    console.log('='.repeat(60));
    console.log(`\n✅ Total migrated: ${totalMigrated} document(s)`);
    console.log(`⚠️  Total skipped: ${totalSkipped} collection(s)`);
    
    // Verify new database collections
    console.log('\n📋 Collections in NEW database:');
    const newCollections = await newConnection.db.listCollections().toArray();
    newCollections.forEach(col => console.log(`   - ${col.name}`));
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    // Close connections
    if (oldConnection) {
      await oldConnection.close();
      console.log('\n👋 Closed connection to OLD database');
    }
    if (newConnection) {
      await newConnection.close();
      console.log('👋 Closed connection to NEW database');
    }
  }
}

// Run migration
migrateDatabase()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });

