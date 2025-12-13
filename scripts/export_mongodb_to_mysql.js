/**
 * MongoDB to MySQL Export Script
 * 
 * PURPOSE:
 * Connects to MongoDB Atlas, scans all collections, and generates MySQL
 * CREATE TABLE and INSERT statements for importing data into MySQL.
 * 
 * USAGE:
 * node scripts/export_mongodb_to_mysql.js
 * 
 * OUTPUT:
 * Creates a file: scripts/mysql_import.sql
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://raraix1x6_db_user:hW6OCIWYwNPMErQS@cluster0.3cpesww.mongodb.net/immacare_db?appName=Cluster0';

// Output file path
const OUTPUT_FILE = path.join(__dirname, 'mysql_import.sql');

// Helper function to escape MySQL strings
function escapeMySQLString(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  if (value instanceof Date) {
    return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
  }
  if (typeof value === 'object') {
    // For ObjectId or other objects, convert to string
    return `'${String(value).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
  }
  // String value
  return `'${String(value).replace(/'/g, "''").replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
}

// Helper function to determine MySQL column type from MongoDB value
function getMySQLType(value, fieldName) {
  if (fieldName === '_id' || fieldName.endsWith('Id') || fieldName === 'userId') {
    return 'VARCHAR(24)';
  }
  if (fieldName === 'email' || fieldName === 'emailAddress') {
    return 'VARCHAR(255)';
  }
  if (fieldName === 'password') {
    return 'VARCHAR(255)';
  }
  if (fieldName === 'phone' || fieldName === 'mobileNumber' || fieldName === 'emergencyMobileNumber') {
    return 'VARCHAR(20)';
  }
  if (fieldName === 'token') {
    return 'VARCHAR(255)';
  }
  if (fieldName === 'recommendation' || fieldName === 'homeAddress' || fieldName === 'allergies' || 
      fieldName === 'currentMedication' || fieldName === 'pastMedicalCondition' || fieldName === 'chronicIllness') {
    return 'TEXT';
  }
  
  if (value === null || value === undefined) {
    return 'VARCHAR(255)';
  }
  if (typeof value === 'boolean') {
    return 'TINYINT(1)';
  }
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return 'INT';
    }
    return 'DECIMAL(10,2)';
  }
  if (value instanceof Date) {
    return 'DATETIME';
  }
  if (typeof value === 'string') {
    if (value.length > 255) {
      return 'TEXT';
    }
    return 'VARCHAR(255)';
  }
  return 'VARCHAR(255)';
}

// Generate CREATE TABLE statement
function generateCreateTable(collectionName, documents) {
  if (documents.length === 0) {
    return null;
  }

  // Collect all unique fields from all documents
  const fieldTypes = new Map();
  
  for (const doc of documents) {
    for (const [key, value] of Object.entries(doc)) {
      if (key === '__v') continue; // Skip version key
      
      if (!fieldTypes.has(key)) {
        fieldTypes.set(key, getMySQLType(value, key));
      }
    }
  }

  // Build CREATE TABLE statement
  const tableName = collectionName.replace(/-/g, '_');
  let sql = `-- Table: ${tableName}\n`;
  sql += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
  sql += `CREATE TABLE \`${tableName}\` (\n`;
  
  const columns = [];
  for (const [field, type] of fieldTypes) {
    let columnDef = `  \`${field}\` ${type}`;
    if (field === '_id') {
      columnDef += ' PRIMARY KEY';
    }
    columns.push(columnDef);
  }
  
  sql += columns.join(',\n');
  sql += '\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n';
  
  return { sql, fields: Array.from(fieldTypes.keys()) };
}

// Generate INSERT statements
function generateInserts(collectionName, documents, fields) {
  if (documents.length === 0) {
    return '';
  }

  const tableName = collectionName.replace(/-/g, '_');
  let sql = `-- Data for table: ${tableName}\n`;
  
  for (const doc of documents) {
    const values = fields.map(field => {
      let value = doc[field];
      return escapeMySQLString(value);
    });
    
    sql += `INSERT INTO \`${tableName}\` (\`${fields.join('`, `')}\`) VALUES (${values.join(', ')});\n`;
  }
  
  sql += '\n';
  return sql;
}

async function main() {
  console.log('🔄 Connecting to MongoDB Atlas...');
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
    
    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`📦 Found ${collections.length} collections`);
    
    let fullSQL = `-- ============================================\n`;
    fullSQL += `-- MySQL Import Script\n`;
    fullSQL += `-- Generated from MongoDB Atlas: immacare_db\n`;
    fullSQL += `-- Generated at: ${new Date().toISOString()}\n`;
    fullSQL += `-- ============================================\n\n`;
    fullSQL += `SET NAMES utf8mb4;\n`;
    fullSQL += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;
    
    let totalDocuments = 0;
    
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n📄 Processing collection: ${collectionName}`);
      
      const collection = db.collection(collectionName);
      const documents = await collection.find({}).toArray();
      
      console.log(`   Found ${documents.length} documents`);
      totalDocuments += documents.length;
      
      if (documents.length === 0) {
        fullSQL += `-- Collection ${collectionName} is empty\n\n`;
        continue;
      }
      
      // Generate CREATE TABLE
      const tableResult = generateCreateTable(collectionName, documents);
      if (tableResult) {
        fullSQL += tableResult.sql;
        
        // Generate INSERT statements
        fullSQL += generateInserts(collectionName, documents, tableResult.fields);
      }
    }
    
    fullSQL += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    fullSQL += `-- ============================================\n`;
    fullSQL += `-- End of import script\n`;
    fullSQL += `-- Total documents exported: ${totalDocuments}\n`;
    fullSQL += `-- ============================================\n`;
    
    // Write to file
    fs.writeFileSync(OUTPUT_FILE, fullSQL, 'utf8');
    console.log(`\n✅ MySQL import script generated successfully!`);
    console.log(`📁 Output file: ${OUTPUT_FILE}`);
    console.log(`📊 Total documents exported: ${totalDocuments}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

main();
