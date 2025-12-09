/**
 * SQL to MongoDB Migration Script
 * 
 * Migrates data from SQL dump files to MongoDB with new collection names
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// NEW MongoDB connection (username/password)
// Override any .env setting with the new connection string
const NEW_MONGODB_URI = 'mongodb+srv://raraix1x6_db_user:hW6OCIWYwNPMErQS@cluster0.3cpesww.mongodb.net/immacare_db?retryWrites=true&w=majority&appName=Cluster0';

// Collection names in new database
const COLLECTIONS = {
  users: 'users_info',
  appointments: 'appointment_booking',
  doctorprofiles: 'doctors_profile',
  patients: 'patient_info',
  doctorrecommendations: 'doctor_recommendations',
  inventories: 'inventory',
  inventorycategories: 'inventory_category'
};

/**
 * Parse SQL INSERT statements and extract data
 */
function parseSQLInsert(sqlContent, tableName) {
  const rows = [];
  // Match INSERT INTO `table_name` (...) VALUES (...), (...), ...;
  // Handle multi-line INSERT statements
  const escapedTableName = tableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match INSERT INTO with optional backticks, column list, VALUES, and all values until semicolon
  const regexPattern = `INSERT INTO[\\s\\n]*\\\`?${escapedTableName}\\\`?[\\s\\n]*\\([^)]+\\)[\\s\\n]*VALUES[\\s\\n]*([\\s\\S]+?);`;
  const regex = new RegExp(regexPattern, 'gi');
  let match;
  
  // Debug: check if table name is found
  if (!sqlContent.includes(tableName)) {
    console.log(`   ⚠️  Table name "${tableName}" not found in SQL`);
    return rows;
  }
  
  // Find all INSERT statements for this table (in case there are multiple)
  let valuesString = '';
  while ((match = regex.exec(sqlContent)) !== null) {
    valuesString += (valuesString ? '),(' : '') + match[1].trim();
  }
  
  if (!valuesString) {
    console.log(`   ⚠️  No INSERT statement found for table "${tableName}"`);
    return rows;
  }
  
  valuesString = valuesString.trim();
  // Parse individual rows - split by ),( or ),\n( to handle multi-line INSERTs
  // First, normalize the string by removing extra whitespace
  const normalized = valuesString.replace(/\s+/g, ' ').trim();
  
  // Split rows by pattern: ),( or ), ( or )\n,(
  const rowStrings = normalized.split(/\),\s*\(/);
  
  for (let rowIdx = 0; rowIdx < rowStrings.length; rowIdx++) {
    let rowStr = rowStrings[rowIdx];
    // Remove leading ( from first row and trailing ) from last row
    if (rowIdx === 0) {
      rowStr = rowStr.replace(/^\(/, '');
    }
    if (rowIdx === rowStrings.length - 1) {
      rowStr = rowStr.replace(/\)$/, '');
    } else {
      // For middle rows, they should already be clean
    }
    
    if (!rowStr.trim()) continue;
    
    const rowValues = [];
      let currentValue = '';
      let inQuotes = false;
      let quoteChar = null;
      
      // Parse values manually to handle commas inside quotes and multi-line values
      for (let i = 0; i < rowStr.length; i++) {
        const char = rowStr[i];
        const prevChar = i > 0 ? rowStr[i - 1] : '';
        
        if (!inQuotes && (char === '"' || char === "'")) {
          inQuotes = true;
          quoteChar = char;
          currentValue += char;
        } else if (inQuotes && char === quoteChar && prevChar !== '\\') {
          // Check if it's an escaped quote
          if (i + 1 < rowStr.length && rowStr[i + 1] === quoteChar) {
            currentValue += char + char;
            i++; // Skip next quote
          } else {
            inQuotes = false;
            quoteChar = null;
            currentValue += char;
          }
        } else if (!inQuotes && char === ',') {
          // End of value
          let value = currentValue.trim();
          // Remove quotes
          if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
            value = value.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/''/g, "'");
          }
          // Handle NULL
          if (value.toUpperCase() === 'NULL' || value === '') {
            rowValues.push(null);
          } else if (/^-?\d+$/.test(value)) {
            rowValues.push(parseInt(value));
          } else if (/^-?\d+\.\d+$/.test(value)) {
            rowValues.push(parseFloat(value));
          } else {
            rowValues.push(value);
          }
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add last value
      if (currentValue.trim()) {
        let value = currentValue.trim();
        if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
          value = value.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"');
        }
        if (value.toUpperCase() === 'NULL') {
          rowValues.push(null);
        } else if (/^\d+$/.test(value)) {
          rowValues.push(parseInt(value));
        } else if (/^\d+\.\d+$/.test(value)) {
          rowValues.push(parseFloat(value));
        } else {
          rowValues.push(value);
        }
      }
      
      if (rowValues.length > 0) {
        rows.push(rowValues);
      }
    }
  
  console.log(`   📊 Parsed ${rows.length} rows from ${tableName}`);
  return rows;
}

/**
 * Get column names from SQL CREATE TABLE
 */
function getColumnNames(sqlContent, tableName) {
  const escapedTableName = tableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const createRegex = new RegExp(`CREATE TABLE\\s+\\\`?${escapedTableName}\\\`?`, 'i');
  const match = createRegex.exec(sqlContent);
  if (!match) return [];

  const startIndex = sqlContent.indexOf('(', match.index);
  if (startIndex === -1) return [];

  let depth = 0;
  let endIndex = -1;
  for (let i = startIndex; i < sqlContent.length; i++) {
    const char = sqlContent[i];
    if (char === '(') {
      depth++;
    } else if (char === ')') {
      depth--;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex === -1) return [];

  const tableDefinition = sqlContent.slice(startIndex + 1, endIndex);
  const columnDefs = [];
  let current = '';
  let parenDepth = 0;

  for (let i = 0; i < tableDefinition.length; i++) {
    const char = tableDefinition[i];

    if (char === '(') {
      parenDepth++;
    } else if (char === ')') {
      parenDepth = Math.max(parenDepth - 1, 0);
    }

    if (char === ',' && parenDepth === 0) {
      if (current.trim()) {
        columnDefs.push(current.trim());
      }
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    columnDefs.push(current.trim());
  }

  const columns = [];
  columnDefs.forEach(def => {
    const trimmed = def.trim();
    if (
      !trimmed ||
      /^PRIMARY KEY/i.test(trimmed) ||
      /^UNIQUE KEY/i.test(trimmed) ||
      /^KEY /i.test(trimmed) ||
      /^CONSTRAINT/i.test(trimmed)
    ) {
      return;
    }

    const colMatch = trimmed.match(/`([^`]+)`/);
    if (colMatch) {
      columns.push(colMatch[1]);
    }
  });

  return columns;
}

/**
 * Convert SQL row to MongoDB document
 */
function sqlRowToDocument(row, columns) {
  const doc = {};
  columns.forEach((col, index) => {
    if (row[index] !== undefined && row[index] !== null) {
      // Convert snake_case to camelCase for some fields
      const mongoField = col
        .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
        .replace(/^[a-z]/, letter => letter.toLowerCase());
      doc[mongoField] = row[index];
    }
  });
  return doc;
}

/**
 * Migrate users (combines users_info and account_info)
 */
async function migrateUsers(db, sqlContent) {
  console.log('\n📦 Migrating Users...');
  
  const usersInfoCols = getColumnNames(sqlContent, 'users_info');
  const accountInfoCols = getColumnNames(sqlContent, 'account_info');
  const usersInfoRows = parseSQLInsert(sqlContent, 'users_info');
  const accountInfoRows = parseSQLInsert(sqlContent, 'account_info');
  
  // Create a map of user_id to account_info
  const accountMap = {};
  accountInfoRows.forEach(row => {
    const cols = accountInfoCols;
    const userId = row[cols.indexOf('user_id')];
    if (userId) {
      accountMap[userId] = {
        email: row[cols.indexOf('email')],
        password: row[cols.indexOf('password')],
        phone: row[cols.indexOf('phone')],
        status: row[cols.indexOf('status')] === 1,
        isVerified: row[cols.indexOf('is_verified')] === 1,
        createdAt: row[cols.indexOf('created_at')] || new Date(),
        updatedAt: row[cols.indexOf('updated_date')] || new Date()
      };
    }
  });
  
  const users = [];
  usersInfoRows.forEach(row => {
    const cols = usersInfoCols;
    const userId = row[cols.indexOf('id')];
    const account = accountMap[userId] || {};
    
    const user = {
      firstname: row[cols.indexOf('firstname')],
      middlename: row[cols.indexOf('middlename')],
      lastname: row[cols.indexOf('lastname')],
      gender: row[cols.indexOf('gender')],
      birthdate: row[cols.indexOf('birthdate')] ? new Date(row[cols.indexOf('birthdate')]) : new Date('2000-01-01'),
      age: row[cols.indexOf('age')],
      role: row[cols.indexOf('role')],
      status: row[cols.indexOf('status')] === 1,
      email: account.email || '',
      password: account.password || '',
      phone: account.phone || null,
      isVerified: account.isVerified || false,
      createdAt: row[cols.indexOf('created_at')] || new Date(),
      updatedAt: account.updatedAt || new Date()
    };
    
    users.push(user);
  });
  
  if (users.length > 0) {
    const collection = db.collection(COLLECTIONS.users);
    await collection.deleteMany({});
    const result = await collection.insertMany(users);
    console.log(`   ✅ Migrated ${users.length} users`);
    
    // Return users with their MongoDB _ids
    const usersWithIds = users.map((user, index) => ({
      ...user,
      _id: result.insertedIds[index]
    }));
    return { users: usersWithIds, insertedIds: result.insertedIds };
  }
  
  return { users: [], insertedIds: {} };
}

/**
 * Migrate appointments
 */
async function migrateAppointments(db, sqlContent, userMap) {
  console.log('\n📦 Migrating Appointments...');
  
  // Get column names first for the mapping
  const cols = getColumnNames(sqlContent, 'appointment_booking');
  const rows = parseSQLInsert(sqlContent, 'appointment_booking');
  
  const appointments = rows.map(row => {
    const patientId = row[cols.indexOf('patient_id')];
    const doctorId = row[cols.indexOf('doctor_id')];
    
    return {
      patientId: userMap[patientId] || null,
      doctorId: doctorId && doctorId !== 0 ? (userMap[doctorId] || null) : null,
      consultationType: row[cols.indexOf('consultation_type')],
      bookingDate: row[cols.indexOf('booking_date')],
      bookingTime: row[cols.indexOf('booking_time')],
      queueNo: row[cols.indexOf('queue_no')],
      status: row[cols.indexOf('status')],
      createdAt: row[cols.indexOf('created_date')] || new Date(),
      updatedAt: row[cols.indexOf('updated_date')] || new Date()
    };
  });
  
  if (appointments.length > 0) {
    const collection = db.collection(COLLECTIONS.appointments);
    await collection.deleteMany({});
    const result = await collection.insertMany(appointments);
    console.log(`   ✅ Migrated ${appointments.length} appointments`);
    
    // Return appointments with their MongoDB _ids and create mapping
    const appointmentsWithIds = appointments.map((apt, index) => ({
      ...apt,
      _id: result.insertedIds[index]
    }));
    
    // Create appointment map: old SQL id -> new MongoDB _id
    const appointmentMap = {};
    const rows = parseSQLInsert(sqlContent, 'appointment_booking');
    rows.forEach((row, index) => {
      const oldId = row[cols.indexOf('id')];
      if (oldId && result.insertedIds[index]) {
        appointmentMap[oldId] = result.insertedIds[index];
      }
    });
    
    return { appointments: appointmentsWithIds, appointmentMap };
  }
  
  return { appointments: [], appointmentMap: {} };
}

/**
 * Migrate doctor profiles
 */
async function migrateDoctorProfiles(db, sqlContent, userMap) {
  console.log('\n📦 Migrating Doctor Profiles...');
  
  const cols = getColumnNames(sqlContent, 'doctors_profile');
  const rows = parseSQLInsert(sqlContent, 'doctors_profile');
  
  const profiles = rows.map(row => {
    const userId = row[cols.indexOf('user_id')];
    return {
      userId: userMap[userId] || null,
      specialty: row[cols.indexOf('specialty')],
      department: row[cols.indexOf('department')] || '',
      yearsOfExperience: row[cols.indexOf('years_of_experience')] || 0,
      professionalBoard: row[cols.indexOf('professional_board')] || '',
      certificate: row[cols.indexOf('certificate')] || '',
      status: row[cols.indexOf('status')] || '1',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }).filter(p => p.userId !== null);
  
  if (profiles.length > 0) {
    const collection = db.collection(COLLECTIONS.doctorprofiles);
    await collection.deleteMany({});
    await collection.insertMany(profiles);
    console.log(`   ✅ Migrated ${profiles.length} doctor profiles`);
  }
  
  return profiles;
}

/**
 * Migrate patient info
 */
async function migratePatients(db, sqlContent, userMap) {
  console.log('\n📦 Migrating Patients...');
  
  const cols = getColumnNames(sqlContent, 'patient_info');
  const rows = parseSQLInsert(sqlContent, 'patient_info');
  
  const patients = rows.map(row => {
    const userId = row[cols.indexOf('user_id')];
    return {
      userId: userMap[userId] || null,
      firstname: row[cols.indexOf('firstname')],
      middlename: row[cols.indexOf('middlename')],
      lastname: row[cols.indexOf('lastname')],
      gender: row[cols.indexOf('gender')],
      birthdate: row[cols.indexOf('birthdate')],
      age: row[cols.indexOf('age')],
      civilStatus: row[cols.indexOf('civil_status')],
      mobileNumber: row[cols.indexOf('mobile_number')],
      emailAddress: row[cols.indexOf('email_address')],
      homeAddress: row[cols.indexOf('home_address')],
      emergencyName: row[cols.indexOf('emergency_name')],
      emergencyRelationship: row[cols.indexOf('emergency_relationship')],
      emergencyMobileNumber: row[cols.indexOf('emergency_mobile_number')],
      bloodtype: row[cols.indexOf('bloodtype')],
      allergies: row[cols.indexOf('allergies')],
      currentMedication: row[cols.indexOf('current_medication')],
      pastMedicalCondition: row[cols.indexOf('past_medical_condition')],
      chronicIllness: row[cols.indexOf('chronic_illness')],
      createdAt: row[cols.indexOf('created_date')] || new Date(),
      updatedAt: row[cols.indexOf('updated_date')] || new Date()
    };
  }).filter(p => p.userId !== null);
  
  if (patients.length > 0) {
    const collection = db.collection(COLLECTIONS.patients);
    await collection.deleteMany({});
    await collection.insertMany(patients);
    console.log(`   ✅ Migrated ${patients.length} patients`);
  }
  
  return patients;
}

/**
 * Migrate doctor recommendations
 */
async function migrateDoctorRecommendations(db, sqlContent, userMap, appointmentMap) {
  console.log('\n📦 Migrating Doctor Recommendations...');
  
  const cols = getColumnNames(sqlContent, 'doctor_recommendations');
  const rows = parseSQLInsert(sqlContent, 'doctor_recommendations');
  
  const recommendations = rows.map(row => {
    const appointmentId = row[cols.indexOf('appointment_id')];
    const doctorId = row[cols.indexOf('doctor_id')];
    
    return {
      appointmentId: appointmentId ? (appointmentMap[appointmentId] || null) : null,
      doctorId: doctorId ? (userMap[doctorId] || null) : null,
      recommendation: row[cols.indexOf('recommendation')],
      followUpRequired: row[cols.indexOf('follow_up_required')] || 'No',
      prescriptionGiven: row[cols.indexOf('prescription_given')] === 1,
      prescription: row[cols.indexOf('prescription')],
      createdAt: row[cols.indexOf('created_at')] || new Date(),
      updatedAt: row[cols.indexOf('updated_at')] || new Date()
    };
  });
  
  if (recommendations.length > 0) {
    const collection = db.collection(COLLECTIONS.doctorrecommendations);
    await collection.deleteMany({});
    await collection.insertMany(recommendations);
    console.log(`   ✅ Migrated ${recommendations.length} doctor recommendations`);
  }
  
  return recommendations;
}

/**
 * Migrate inventory
 */
async function migrateInventory(db, sqlContent, categoryMap) {
  console.log('\n📦 Migrating Inventory...');
  
  const cols = getColumnNames(sqlContent, 'inventory');
  const rows = parseSQLInsert(sqlContent, 'inventory');
  
  const inventories = rows.map(row => {
    const categoryId = row[cols.indexOf('category')];
    return {
      item: row[cols.indexOf('item')],
      category: categoryMap[categoryId] || null,
      quantity: row[cols.indexOf('quantity')] || 0,
      averageQuantity: row[cols.indexOf('average_quantity')],
      price: row[cols.indexOf('price')],
      status: row[cols.indexOf('status')]
    };
  });
  
  if (inventories.length > 0) {
    const collection = db.collection(COLLECTIONS.inventories);
    await collection.deleteMany({});
    await collection.insertMany(inventories);
    console.log(`   ✅ Migrated ${inventories.length} inventory items`);
  }
  
  return inventories;
}

/**
 * Migrate inventory categories
 */
async function migrateInventoryCategories(db, sqlContent) {
  console.log('\n📦 Migrating Inventory Categories...');
  
  const cols = getColumnNames(sqlContent, 'inventory_category');
  const rows = parseSQLInsert(sqlContent, 'inventory_category');
  
  const categories = rows.map(row => ({
    category: row[cols.indexOf('category')]
  }));
  
  if (categories.length > 0) {
    const collection = db.collection(COLLECTIONS.inventorycategories);
    await collection.deleteMany({});
    const result = await collection.insertMany(categories);
    
    // Create map of old ID to new ObjectId
    const categoryMap = {};
    rows.forEach((row, index) => {
      const oldId = row[cols.indexOf('id')];
      categoryMap[oldId] = result.insertedIds[index];
    });
    
    console.log(`   ✅ Migrated ${categories.length} inventory categories`);
    return categoryMap;
  }
  
  return {};
}

/**
 * Seed explicit test accounts (from test_accounts_insert.sql) directly into MongoDB
 * so they are guaranteed to exist regardless of MySQL-specific LAST_INSERT_ID logic.
 */
async function seedTestAccounts(db) {
  console.log('\n📦 Seeding explicit test accounts...');

  const usersCol = db.collection(COLLECTIONS.users);
  const doctorProfilesCol = db.collection(COLLECTIONS.doctorprofiles);
  const patientsCol = db.collection(COLLECTIONS.patients);

  // 1. Admin account
  const adminEmail = 'admin@test.com';
  const adminUser = {
    email: adminEmail,
    password: '$2b$10$vdl9QSTjoAMzbpiKZnApoeVtThqLleHWl6R.XPS5KmyvQWLcLpDX2', // from test_accounts_insert.sql
    phone: '+639123456789',
    status: true,
    isVerified: true,
    firstname: 'Test',
    middlename: 'Admin',
    lastname: 'User',
    gender: 'Male',
    birthdate: new Date('1990-01-01'),
    age: 34,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await usersCol.deleteOne({ email: adminEmail });
  const adminResult = await usersCol.insertOne(adminUser);

  // 2. Doctor account + doctor profile
  const doctorEmail = 'doctor@test.com';
  const doctorUser = {
    email: doctorEmail,
    password: '$2b$10$0HRxJvTVRt6OwCoNfUb3ueQ4uUdVLg2nb/AQ3Ljpts.TWZUmQajN6',
    phone: '+639123456790',
    status: true,
    isVerified: true,
    firstname: 'Test',
    middlename: 'Doctor',
    lastname: 'User',
    gender: 'Female',
    birthdate: new Date('1985-05-15'),
    age: 39,
    role: 'doctor',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await usersCol.deleteOne({ email: doctorEmail });
  const doctorResult = await usersCol.insertOne(doctorUser);

  // Seed doctor profile (specialty 12 as in SQL comments)
  await doctorProfilesCol.deleteOne({ userId: doctorResult.insertedId });
  await doctorProfilesCol.insertOne({
    userId: doctorResult.insertedId,
    specialty: 12,
    department: 'General Medicine',
    yearsOfExperience: 10,
    professionalBoard: '',
    certificate: '',
    status: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // 3. Patient account + patient profile
  const patientEmail = 'patient@test.com';
  const patientUser = {
    email: patientEmail,
    password: '$2b$10$QeGaqbjtl7.giVOhI.SHeumNtiabn3Ax.dabS5pBAEdbhmKpotE3.',
    phone: '+639123456791',
    status: true,
    isVerified: true,
    firstname: 'Test',
    middlename: 'Patient',
    lastname: 'User',
    gender: 'Male',
    birthdate: new Date('1995-08-20'),
    age: 29,
    role: 'patient',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await usersCol.deleteOne({ email: patientEmail });
  const patientResult = await usersCol.insertOne(patientUser);

  // Patient profile mirrors patient_info row in test_accounts_insert.sql
  await patientsCol.deleteOne({ userId: patientResult.insertedId });
  await patientsCol.insertOne({
    userId: patientResult.insertedId,
    firstname: 'Test',
    middlename: 'Patient',
    lastname: 'User',
    gender: 'Male',
    birthdate: '1995-08-20',
    age: '29',
    civilStatus: 'Single',
    mobileNumber: '+639123456791',
    emailAddress: patientEmail,
    homeAddress: '123 Test Street, Test City',
    emergencyName: null,
    emergencyRelationship: null,
    emergencyMobileNumber: null,
    bloodtype: 'O+',
    allergies: null,
    currentMedication: null,
    pastMedicalCondition: null,
    chronicIllness: null,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log('   ✅ Seeded admin@test.com, doctor@test.com, patient@test.com');
}

/**
 * Main migration function
 */
async function migrateSQLToMongoDB() {
  let connection = null;
  
  try {
    console.log('🚀 Starting SQL to MongoDB Migration\n');
    console.log('='.repeat(70));
    
    // Read SQL files
    console.log('\n📖 Reading SQL files...');
    const mainSQLPath = path.join(__dirname, '..', '..', 'immacare_db (4) (1).sql');
    const testSQLPath = path.join(__dirname, '..', 'test_accounts_insert.sql');
    
    if (!fs.existsSync(mainSQLPath)) {
      throw new Error(`SQL file not found: ${mainSQLPath}`);
    }
    
    const mainSQL = fs.readFileSync(mainSQLPath, 'utf8');
    const testSQL = fs.existsSync(testSQLPath) ? fs.readFileSync(testSQLPath, 'utf8') : '';
    const sqlContent = mainSQL + '\n' + testSQL;
    
    console.log('   ✅ SQL files loaded');
    
    // Connect to MongoDB
    console.log('\n🔄 Connecting to MongoDB...');
    connection = await mongoose.createConnection(NEW_MONGODB_URI).asPromise();
    const db = connection.db;
    console.log('   ✅ Connected successfully');
    
    // Migrate in order (dependencies first)
    console.log('\n' + '='.repeat(70));
    console.log('📦 Starting Data Migration...');
    console.log('='.repeat(70));
    
    // 1. Users (needed for references)
    const { users, insertedIds } = await migrateUsers(db, sqlContent);
    const userMap = {}; // Map old MySQL user_id to new MongoDB _id
    // Create a map from old user_id (from SQL) to new MongoDB _id
    // We need to match users by their position/index since we insert in order
    const usersInfoRows = parseSQLInsert(sqlContent, 'users_info');
    const usersInfoCols = getColumnNames(sqlContent, 'users_info');
    
    console.log(`   🔍 Debug: usersInfoCols =`, usersInfoCols.slice(0, 5));
    console.log(`   🔍 Debug: First row has ${usersInfoRows[0]?.length} values`);
    
    // insertedIds is an object with numeric keys (0, 1, 2, ...)
    users.forEach((user, index) => {
      if (index < usersInfoRows.length && usersInfoRows[index]) {
        const idColIndex = usersInfoCols.indexOf('id');
        if (idColIndex >= 0 && idColIndex < usersInfoRows[index].length) {
          const oldUserId = usersInfoRows[index][idColIndex];
          // insertedIds keys are the array indices (as strings in the object)
          const mongoId = insertedIds[index] || (user._id ? user._id.toString() : null);
          if (oldUserId && mongoId) {
            userMap[oldUserId] = mongoId;
          }
        }
      }
    });
    
    console.log(`   📋 Created userMap with ${Object.keys(userMap).length} mappings`);
    if (Object.keys(userMap).length === 0 && usersInfoRows.length > 0) {
      console.log(`   ⚠️  WARNING: userMap is empty!`);
      console.log(`   🔍 Debug: First row values:`, usersInfoRows[0]);
      console.log(`   🔍 Debug: Column 'id' index:`, usersInfoCols.indexOf('id'));
    }
    
    // 2. Inventory Categories (needed for inventory)
    const categoryMap = await migrateInventoryCategories(db, sqlContent);
    
    // 3. Doctor Profiles
    await migrateDoctorProfiles(db, sqlContent, userMap);
    
    // 4. Patients
    await migratePatients(db, sqlContent, userMap);
    
    // 5. Appointments
    const { appointments, appointmentMap } = await migrateAppointments(db, sqlContent, userMap);
    
    // 6. Doctor Recommendations
    await migrateDoctorRecommendations(db, sqlContent, userMap, appointmentMap);
    
    // 7. Inventory
    await migrateInventory(db, sqlContent, categoryMap);

    // 8. Explicit test accounts (admin, doctor, patient)
    await seedTestAccounts(db);
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('✅ MIGRATION COMPLETE!');
    console.log('='.repeat(70));
    
    // Show collection counts
    for (const [name, collectionName] of Object.entries(COLLECTIONS)) {
      const count = await db.collection(collectionName).countDocuments();
      console.log(`   ${collectionName.padEnd(25)} : ${count} document(s)`);
    }
    
    console.log('\n🎉 All data has been migrated successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
      console.log('\n👋 Database connection closed');
    }
  }
}

// Run migration
migrateSQLToMongoDB()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed');
    process.exit(1);
  });

