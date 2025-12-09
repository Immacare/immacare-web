/**
 * Complete Database Migration Script
 * 
 * Migrates ALL data from old MongoDB to new MongoDB with new collection names
 * Handles X509 authentication and provides fallback options
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Try to use mongodb driver if available, otherwise use mongoose
let MongoClient;
try {
  MongoClient = require('mongodb').MongoClient;
} catch (e) {
  console.log('⚠️  mongodb driver not found, using mongoose connections...');
  MongoClient = null;
}

// OLD DATABASE (with old collection names)
const OLD_MONGODB_URI = process.env.OLD_MONGODB_URI || 'mongodb+srv://raijinjyn1_db_user:oU0KAxmow1QC8Z5P@immacare.nbppppb.mongodb.net/immacare_db?retryWrites=true&w=majority&appName=Immacare';

// NEW DATABASE (X509 authenticated)
const NEW_MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://immacare.xr6wcn1.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&appName=immacare';

// Collection mapping: OLD_NAME -> NEW_NAME
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
 * Connect to MongoDB using mongoose (better X509 support)
 */
async function connectToDatabase(uri, label, isX509 = false) {
  try {
    let options = {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    };
    
    if (isX509) {
      // Try to use certificate files if provided
      if (process.env.MONGODB_TLS_CERT_FILE && process.env.MONGODB_TLS_KEY_FILE) {
        const certPath = path.resolve(process.env.MONGODB_TLS_CERT_FILE);
        const keyPath = path.resolve(process.env.MONGODB_TLS_KEY_FILE);
        
        if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
          options.tls = true;
          options.tlsCertificateKeyFile = certPath;
          
          if (process.env.MONGODB_TLS_CA_FILE) {
            const caPath = path.resolve(process.env.MONGODB_TLS_CA_FILE);
            if (fs.existsSync(caPath)) {
              options.tlsCAFile = caPath;
            }
          }
        }
      }
      // For MongoDB Atlas X509, mongoose should handle system certificates
    }
    
    // Use mongoose connection
    const connection = await mongoose.createConnection(uri, options).asPromise();
    // Test the connection
    await connection.db.admin().ping();
    console.log(`✅ Connected to ${label} database`);
    return connection;
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
    
    const oldCollection = oldDb.collection(oldCollectionName);
    const documents = await oldCollection.find({}).toArray();
    
    if (documents.length === 0) {
      console.log(`   ⚠️  No documents found in ${oldCollectionName}`);
      return { migrated: 0, skipped: 0 };
    }
    
    console.log(`   📊 Found ${documents.length} document(s)`);
    
    const newCollection = newDb.collection(newCollectionName);
    
    // Check if collection exists and has data
    const existingCount = await newCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`   ⚠️  Collection ${newCollectionName} already has ${existingCount} document(s)`);
      console.log(`   🔄 Dropping existing collection to replace with migrated data...`);
      await newCollection.drop();
    }
    
    // Insert all documents
    if (documents.length > 0) {
      // Remove _id fields to let MongoDB generate new ones, or keep them if they're ObjectIds
      const documentsToInsert = documents.map(doc => {
        // Convert MySQL-style _id (numbers) to MongoDB ObjectIds if needed
        if (doc._id && typeof doc._id === 'number') {
          delete doc._id; // Let MongoDB generate new ObjectId
        }
        return doc;
      });
      
      await newCollection.insertMany(documentsToInsert, { ordered: false });
    }
    
    console.log(`   ✅ Successfully migrated ${documents.length} document(s) to ${newCollectionName}`);
    return { migrated: documents.length, skipped: 0 };
    
  } catch (error) {
    console.error(`   ❌ Error migrating ${oldCollectionName}:`, error.message);
    if (error.writeErrors) {
      console.error(`   ⚠️  Some documents failed to insert:`, error.writeErrors.length);
    }
    return { migrated: 0, skipped: 1 };
  }
}

/**
 * Main migration function
 */
async function migrateDatabase() {
  let oldClient = null;
  let newClient = null;
  
  try {
    console.log('🚀 Starting Complete Database Migration\n');
    console.log('='.repeat(70));
    console.log('📋 Collection Mapping:');
    Object.entries(COLLECTION_MAPPING).forEach(([old, newName]) => {
      console.log(`   ${old.padEnd(25)} → ${newName}`);
    });
    console.log('='.repeat(70));
    
    // Connect to OLD database
    console.log('\n🔄 Step 1: Connecting to OLD database...');
    oldClient = await connectToDatabase(OLD_MONGODB_URI, 'OLD', false);
    const oldDb = oldClient.db;
    
    // List collections in old database
    const collections = await oldDb.listCollections().toArray();
    const oldCollectionNames = collections.map(col => col.name);
    
    console.log(`\n📊 Found ${oldCollectionNames.length} collection(s) in OLD database:`);
    oldCollectionNames.forEach(name => console.log(`   - ${name}`));
    
    // Connect to NEW database
    console.log('\n🔄 Step 2: Connecting to NEW database (X509)...');
    let connectionAttempts = 0;
    const maxAttempts = 3;
    
    while (connectionAttempts < maxAttempts) {
      try {
        newClient = await connectToDatabase(NEW_MONGODB_URI, 'NEW', true);
        break;
      } catch (error) {
        connectionAttempts++;
        if (error.message.includes('certificate')) {
          console.log(`\n⚠️  X509 Certificate validation failed (attempt ${connectionAttempts}/${maxAttempts})`);
          if (connectionAttempts < maxAttempts) {
            console.log('   💡 Trying alternative connection method...');
            // Try with username/password if provided
            if (process.env.NEW_MONGODB_URI_USER_PASS) {
              console.log('   🔄 Trying username/password connection...');
              newClient = await connectToDatabase(process.env.NEW_MONGODB_URI_USER_PASS, 'NEW', false);
              break;
            }
          }
          if (connectionAttempts >= maxAttempts) {
            throw new Error('Failed to connect to new database. Please check X509 certificates or provide username/password connection string.');
          }
        } else {
          throw error;
        }
      }
    }
    
    const newDb = newClient.db;
    
    // Migrate each collection
    console.log('\n🔄 Step 3: Migrating collections...');
    console.log('='.repeat(70));
    
    let totalMigrated = 0;
    let totalSkipped = 0;
    const results = [];
    
    for (const [oldName, newName] of Object.entries(COLLECTION_MAPPING)) {
      if (oldCollectionNames.includes(oldName)) {
        const result = await migrateCollection(oldDb, newDb, oldName, newName);
        totalMigrated += result.migrated;
        totalSkipped += result.skipped;
        results.push({ oldName, newName, ...result });
      } else {
        console.log(`\n⚠️  Collection ${oldName} not found in old database, skipping...`);
        results.push({ oldName, newName, migrated: 0, skipped: 1 });
        totalSkipped++;
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(70));
    results.forEach(({ oldName, newName, migrated, skipped }) => {
      if (migrated > 0) {
        console.log(`   ✅ ${oldName.padEnd(25)} → ${newName.padEnd(20)} : ${migrated} document(s)`);
      } else if (skipped > 0) {
        console.log(`   ⚠️  ${oldName.padEnd(25)} → ${newName.padEnd(20)} : Skipped`);
      }
    });
    console.log('='.repeat(70));
    console.log(`\n✅ Total migrated: ${totalMigrated} document(s)`);
    console.log(`⚠️  Total skipped: ${totalSkipped} collection(s)`);
    
    // Verify new database
    console.log('\n📋 Collections in NEW database:');
    const newCollections = await newDb.listCollections().toArray();
    for (const col of newCollections) {
      const count = await newDb.collection(col.name).countDocuments();
      console.log(`   - ${col.name.padEnd(25)} : ${count} document(s)`);
    }
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    throw error;
  } finally {
    if (oldClient) {
      await oldClient.close();
      console.log('\n👋 Closed connection to OLD database');
    }
    if (newClient) {
      await newClient.close();
      console.log('👋 Closed connection to NEW database');
    }
    // Close mongoose connections
    await mongoose.connection.close();
  }
}

// Run migration
console.log('🚀 Starting Complete Database Migration...\n');
migrateDatabase()
  .then(() => {
    console.log('\n🎉 All done! Your data has been migrated to the new database.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error.message);
    console.error('\n💡 TIPS:');
    console.error('   1. If X509 certificate validation fails, you can:');
    console.error('      - Set up X509 certificates in MongoDB Atlas');
    console.error('      - Or temporarily use username/password: Set NEW_MONGODB_URI_USER_PASS in .env');
    console.error('   2. Make sure your IP is whitelisted in MongoDB Atlas');
    console.error('   3. Check that the database user has proper permissions');
    process.exit(1);
  });

