/**
 * Check New Database Collections
 * 
 * This script checks what collections exist in the new database
 * and verifies if migration is needed.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const NEW_MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://immacare.xr6wcn1.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&appName=immacare';

async function checkDatabase() {
  let connection = null;
  
  try {
    console.log('🔍 Checking New Database...\n');
    
    // Build connection options (same as main config)
    const connectionOptions = {};
    
    if (process.env.MONGODB_TLS_CERT_FILE && process.env.MONGODB_TLS_KEY_FILE) {
      const certPath = path.resolve(process.env.MONGODB_TLS_CERT_FILE);
      const keyPath = path.resolve(process.env.MONGODB_TLS_KEY_FILE);
      
      if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        connectionOptions.tls = true;
        connectionOptions.tlsCertificateKeyFile = certPath;
        
        if (process.env.MONGODB_TLS_CA_FILE) {
          const caPath = path.resolve(process.env.MONGODB_TLS_CA_FILE);
          if (fs.existsSync(caPath)) {
            connectionOptions.tlsCAFile = caPath;
          }
        }
      }
    }
    
    console.log('🔄 Attempting to connect...');
    connection = await mongoose.createConnection(NEW_MONGODB_URI, connectionOptions).asPromise();
    console.log('✅ Connected successfully!\n');
    
    const db = connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📋 Collections in new database:');
    console.log('='.repeat(60));
    collections.forEach(col => {
      db.collection(col.name).countDocuments().then(count => {
        console.log(`   - ${col.name} (${count} documents)`);
      });
    });
    
    // Wait a bit for counts
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n✅ Check complete!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('certificate')) {
      console.log('\n💡 TIP: X509 certificate validation failed.');
      console.log('   You may need to:');
      console.log('   1. Set up X509 certificates in MongoDB Atlas');
      console.log('   2. Or use a username/password connection string for migration');
      console.log('   3. Set MONGODB_TLS_CERT_FILE and MONGODB_TLS_KEY_FILE in .env');
    }
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

checkDatabase();















