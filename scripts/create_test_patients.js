/**
 * Script to create test patient users
 * Run with: node scripts/create_test_patients.js
 */

require('dotenv').config();
const { connectMongoDB, mongoose } = require('../config/mongodb');
const User = require('../models/User');

const testPatients = [
  {
    email: 'patient1@test.com',
    password: 'patient123',
    firstname: 'Patient',
    lastname: 'One',
    gender: 'Male',
    birthdate: new Date('1990-01-01'),
    role: 'patient',
    isVerified: true,
    status: true
  },
  {
    email: 'patient2@test.com',
    password: 'patient123',
    firstname: 'Patient',
    lastname: 'Two',
    gender: 'Female',
    birthdate: new Date('1991-02-02'),
    role: 'patient',
    isVerified: true,
    status: true
  },
  {
    email: 'patient3@test.com',
    password: 'patient123',
    firstname: 'Patient',
    lastname: 'Three',
    gender: 'Male',
    birthdate: new Date('1992-03-03'),
    role: 'patient',
    isVerified: true,
    status: true
  },
  {
    email: 'patient4@test.com',
    password: 'patient123',
    firstname: 'Patient',
    lastname: 'Four',
    gender: 'Female',
    birthdate: new Date('1993-04-04'),
    role: 'patient',
    isVerified: true,
    status: true
  },
  {
    email: 'patient5@test.com',
    password: 'patient123',
    firstname: 'Patient',
    lastname: 'Five',
    gender: 'Male',
    birthdate: new Date('1994-05-05'),
    role: 'patient',
    isVerified: true,
    status: true
  }
];

async function createTestPatients() {
  try {
    // Connect to MongoDB
    const connected = await connectMongoDB();
    if (!connected) {
      console.error('Failed to connect to MongoDB');
      process.exit(1);
    }

    console.log('\n📝 Creating test patient users...\n');

    for (const patientData of testPatients) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: patientData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${patientData.email} already exists, skipping...`);
        continue;
      }

      // Create new user
      const user = new User(patientData);
      await user.save();
      console.log(`✅ Created user: ${patientData.email}`);
    }

    console.log('\n🎉 Test patient creation completed!\n');
    
  } catch (error) {
    console.error('❌ Error creating test patients:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

createTestPatients();
