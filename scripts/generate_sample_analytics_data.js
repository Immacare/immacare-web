/**
 * Generate Sample Analytics Data Script
 * 
 * PURPOSE:
 * Creates sample data for appointments, inventory, and patients to demonstrate
 * the predictive analytics functionality.
 * 
 * USAGE:
 * node scripts/generate_sample_analytics_data.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { connectMongoDB } = require('../config/mongodb');

// Import models
const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const Appointment = require('../models/Appointment');
const Inventory = require('../models/Inventory');
const InventoryCategory = require('../models/InventoryCategory');

/**
 * Generate random date within range
 */
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate sample appointments over the past 30 days
 */
async function generateSampleAppointments() {
  console.log('\n📅 Generating sample appointments...');
  
  // Get all patients
  const patients = await PatientProfile.find().lean();
  if (patients.length === 0) {
    console.log('   ⚠️  No patients found. Please create patients first.');
    return;
  }
  
  // Consultation types
  const consultationTypes = [
    'General Consultation',
    'ECG',
    'Ultrasound',
    'Laboratory',
    'Internal Medicine',
    'Pediatrics',
    'ENT',
    'Ophthalmology',
    'Dermatology',
    'Family Planning',
    'Prenatal',
    'Vaccination'
  ];
  
  const statuses = ['Booked', 'Completed', 'Cancelled'];
  
  // Generate appointments for the past 90 days (3 months) for better analytics
  const today = new Date();
  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(today.getDate() - 90);
  
  const appointments = [];
  // Generate more appointments: 5-8 per patient for better trend analysis
  const numAppointments = Math.min(patients.length * 6, 500); // Up to 500 appointments
  
  // Create appointment patterns (more on weekdays, less on weekends)
  for (let i = 0; i < numAppointments; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    let appointmentDate = randomDate(ninetyDaysAgo, today);
    
    // Adjust for weekday patterns (more appointments Mon-Fri)
    const dayOfWeek = appointmentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend - 30% chance to keep, otherwise regenerate
      if (Math.random() > 0.3) {
        appointmentDate = randomDate(ninetyDaysAgo, today);
      }
    }
    
    // Format date as MM-DD-YYYY
    const month = String(appointmentDate.getMonth() + 1).padStart(2, '0');
    const day = String(appointmentDate.getDate()).padStart(2, '0');
    const year = appointmentDate.getFullYear();
    const bookingDate = `${month}-${day}-${year}`;
    
    // Random time between 8 AM and 5 PM, with peak hours (9-11 AM, 2-4 PM)
    let hour, minute;
    const rand = Math.random();
    if (rand < 0.4) {
      // Peak morning hours (9-11 AM)
      hour = Math.floor(Math.random() * 3) + 9;
    } else if (rand < 0.7) {
      // Peak afternoon hours (2-4 PM)
      hour = Math.floor(Math.random() * 3) + 14;
    } else {
      // Other hours (8 AM, 12 PM, 5 PM)
      hour = [8, 12, 17][Math.floor(Math.random() * 3)];
    }
    minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    const bookingTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
    // More realistic status distribution (70% completed, 20% booked, 10% cancelled)
    let status;
    const statusRand = Math.random();
    if (statusRand < 0.7) {
      status = 'Completed';
    } else if (statusRand < 0.9) {
      status = 'Booked';
    } else {
      status = 'Cancelled';
    }
    
    // More realistic reasons based on consultation type
    const consultationType = consultationTypes[Math.floor(Math.random() * consultationTypes.length)];
    const reasons = {
      'General Consultation': ['Routine check-up', 'Follow-up visit', 'Health screening', 'Annual physical'],
      'ECG': ['Heart check', 'Chest pain', 'Irregular heartbeat', 'Pre-surgery clearance'],
      'Ultrasound': ['Pregnancy check', 'Abdominal pain', 'Organ examination', 'Prenatal care'],
      'Laboratory': ['Blood test', 'Urine test', 'Health screening', 'Diagnostic test'],
      'Internal Medicine': ['Hypertension follow-up', 'Diabetes management', 'Chronic disease check'],
      'Pediatrics': ['Child vaccination', 'Growth check', 'Fever consultation', 'Well-baby visit'],
      'ENT': ['Ear infection', 'Sinus problem', 'Throat examination', 'Hearing test'],
      'Ophthalmology': ['Eye exam', 'Vision check', 'Eye infection', 'Glaucoma screening'],
      'Dermatology': ['Skin rash', 'Mole check', 'Acne treatment', 'Skin allergy'],
      'Family Planning': ['Contraception consultation', 'Reproductive health', 'STD screening'],
      'Prenatal': ['Pregnancy check-up', 'Fetal monitoring', 'Prenatal care', 'Ultrasound scan'],
      'Vaccination': ['COVID-19 vaccine', 'Flu shot', 'Childhood vaccination', 'Travel vaccine']
    };
    
    const reasonOptions = reasons[consultationType] || ['Medical consultation'];
    const reason = reasonOptions[Math.floor(Math.random() * reasonOptions.length)];
    
    appointments.push({
      patientId: patient._id,
      doctorId: null, // Can be set if you have doctors
      consultationType: consultationType,
      bookingDate: bookingDate,
      bookingTime: bookingTime,
      queueNo: String(Math.floor(Math.random() * 50) + 1),
      status: status,
      reason: reason,
      createdAt: appointmentDate,
      updatedAt: appointmentDate
    });
  }
  
  // Insert appointments
  if (appointments.length > 0) {
    await Appointment.insertMany(appointments);
    console.log(`   ✅ Created ${appointments.length} sample appointments`);
  }
}

/**
 * Generate sample inventory items with various stock levels
 */
async function generateSampleInventory() {
  console.log('\n📦 Generating sample inventory data...');
  
  // Get or create inventory categories
  let category = await InventoryCategory.findOne();
  if (!category) {
    category = new InventoryCategory({
      category: 'Medical Supplies'
    });
    await category.save();
    console.log('   ✅ Created default inventory category');
  }
  
  // Expanded inventory with more items and realistic stock levels
  const inventoryItems = [
    // Critical items (low stock)
    { name: 'Disposable Syringes 5ml', quantity: 15, avgQty: 100, price: 2.50, usageRate: 8 },
    { name: 'Disposable Syringes 10ml', quantity: 22, avgQty: 80, price: 3.00, usageRate: 6 },
    { name: 'Surgical Gloves (Box)', quantity: 8, avgQty: 50, price: 25.00, usageRate: 3 },
    { name: 'Gauze Pads', quantity: 5, avgQty: 40, price: 15.00, usageRate: 5 },
    { name: 'IV Catheters', quantity: 12, avgQty: 80, price: 4.00, usageRate: 7 },
    { name: 'Blood Collection Tubes', quantity: 18, avgQty: 100, price: 1.20, usageRate: 10 },
    { name: 'Disposable Needles', quantity: 20, avgQty: 120, price: 0.80, usageRate: 12 },
    
    // Medium stock items
    { name: 'Alcohol Swabs', quantity: 85, avgQty: 200, price: 1.50, usageRate: 15 },
    { name: 'Bandages', quantity: 35, avgQty: 60, price: 5.00, usageRate: 4 },
    { name: 'Cotton Balls', quantity: 45, avgQty: 100, price: 8.00, usageRate: 6 },
    { name: 'Face Masks (Box)', quantity: 28, avgQty: 50, price: 30.00, usageRate: 2 },
    { name: 'Hand Sanitizer', quantity: 32, avgQty: 40, price: 12.00, usageRate: 3 },
    { name: 'Surgical Masks', quantity: 25, avgQty: 45, price: 20.00, usageRate: 3 },
    { name: 'Disposable Gowns', quantity: 18, avgQty: 30, price: 45.00, usageRate: 2 },
    { name: 'Medical Tape', quantity: 42, avgQty: 70, price: 3.50, usageRate: 5 },
    { name: 'Antiseptic Solution', quantity: 38, avgQty: 60, price: 18.00, usageRate: 4 },
    
    // Well-stocked items
    { name: 'Thermometers', quantity: 12, avgQty: 15, price: 150.00, usageRate: 0.5 },
    { name: 'Blood Pressure Cuff', quantity: 8, avgQty: 10, price: 200.00, usageRate: 0.3 },
    { name: 'Stethoscopes', quantity: 10, avgQty: 12, price: 300.00, usageRate: 0.2 },
    { name: 'Pulse Oximeter', quantity: 9, avgQty: 10, price: 250.00, usageRate: 0.4 },
    { name: 'Glucometer Strips', quantity: 95, avgQty: 100, price: 0.50, usageRate: 8 },
    { name: 'Urine Test Strips', quantity: 88, avgQty: 90, price: 0.75, usageRate: 5 },
    { name: 'Pregnancy Test Kits', quantity: 52, avgQty: 60, price: 12.00, usageRate: 2 },
    { name: 'First Aid Kits', quantity: 15, avgQty: 20, price: 85.00, usageRate: 0.5 }
  ];
  
  // Check existing items and update/create
  for (const item of inventoryItems) {
    let inventoryItem = await Inventory.findOne({ item: item.name });
    
    // Calculate realistic status based on stock level
    // Valid enum values: 'in stock', 'out of stock', 'for reorder', null
    let status;
    const stockPercentage = item.quantity / item.avgQty;
    if (item.quantity === 0) {
      status = 'out of stock';
    } else if (stockPercentage < 0.3) {
      // Low stock = needs reorder
      status = 'for reorder';
    } else {
      status = 'in stock';
    }
    
    if (inventoryItem) {
      // Update existing item
      inventoryItem.quantity = item.quantity;
      inventoryItem.averageQuantity = item.avgQty;
      inventoryItem.price = item.price;
      inventoryItem.status = status;
      await inventoryItem.save();
    } else {
      // Create new item
      inventoryItem = new Inventory({
        item: item.name,
        category: category._id,
        quantity: item.quantity,
        averageQuantity: item.avgQty,
        price: item.price,
        status: status
      });
      await inventoryItem.save();
    }
  }
  
  console.log(`   ✅ Updated/Created ${inventoryItems.length} inventory items`);
}

/**
 * Generate sample patient profiles with health risk factors
 */
async function generateSamplePatients() {
  console.log('\n👥 Generating sample patient profiles...');
  
  // Check if we have users to associate with
  let users = await User.find({ role: 'patient' }).limit(20).lean();
  
  if (users.length < 5) {
    console.log('   ⚠️  Not enough patient users. Creating sample users...');
    
    // Expanded sample names for more diverse patient data
    const sampleNames = [
      { first: 'John', last: 'Doe', middle: 'M' },
      { first: 'Jane', last: 'Smith', middle: 'A' },
      { first: 'Maria', last: 'Garcia', middle: 'L' },
      { first: 'Robert', last: 'Johnson', middle: 'K' },
      { first: 'Linda', last: 'Williams', middle: 'B' },
      { first: 'Michael', last: 'Brown', middle: 'T' },
      { first: 'Sarah', last: 'Davis', middle: 'J' },
      { first: 'David', last: 'Miller', middle: 'R' },
      { first: 'Emily', last: 'Wilson', middle: 'S' },
      { first: 'James', last: 'Moore', middle: 'P' },
      { first: 'Patricia', last: 'Taylor', middle: 'C' },
      { first: 'Christopher', last: 'Anderson', middle: 'D' },
      { first: 'Jessica', last: 'Thomas', middle: 'E' },
      { first: 'Daniel', last: 'Jackson', middle: 'F' },
      { first: 'Lisa', last: 'White', middle: 'G' },
      { first: 'Matthew', last: 'Harris', middle: 'H' },
      { first: 'Amanda', last: 'Martin', middle: 'I' },
      { first: 'Andrew', last: 'Thompson', middle: 'J' },
      { first: 'Michelle', last: 'Garcia', middle: 'K' },
      { first: 'Joshua', last: 'Martinez', middle: 'L' },
      { first: 'Kimberly', last: 'Robinson', middle: 'M' },
      { first: 'Kevin', last: 'Clark', middle: 'N' },
      { first: 'Ashley', last: 'Rodriguez', middle: 'O' },
      { first: 'Brian', last: 'Lewis', middle: 'P' },
      { first: 'Nicole', last: 'Lee', middle: 'Q' }
    ];
    
    // Create more patients for better analytics (25-30 patients)
    for (let i = 0; i < 30; i++) {
      const name = sampleNames[i % sampleNames.length];
      const birthYear = 1950 + Math.floor(Math.random() * 50); // Age 25-75
      const birthDate = new Date(birthYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const age = new Date().getFullYear() - birthYear;
      
      try {
        const user = new User({
          email: `samplepatient${i}@example.com`,
          password: '$2a$10$dummyHashForDemoPurposesOnly123456789',
          firstname: name.first,
          middlename: name.middle,
          lastname: name.last,
          gender: i % 2 === 0 ? 'Male' : 'Female',
          birthdate: birthDate,
          age: age,
          role: 'patient',
          status: true,
          isVerified: true
        });
        await user.save();
      } catch (error) {
        if (!error.message.includes('duplicate')) {
          console.log(`   ⚠️  Error creating user ${i}:`, error.message);
        }
      }
    }
    
    users = await User.find({ role: 'patient' }).limit(20).lean();
  }
  
  // Create patient profiles for users that don't have them
  let created = 0;
  for (const user of users) {
    const existingProfile = await PatientProfile.findOne({ userId: user._id });
    
    if (!existingProfile) {
      const age = user.age || (new Date().getFullYear() - new Date(user.birthdate).getFullYear());
      
      // More realistic health risk distribution
      // Higher age = higher risk of chronic conditions
      const ageRiskFactor = age / 100; // 0.25 to 0.75
      const hasChronicIllness = Math.random() < (0.3 + ageRiskFactor * 0.4); // 30-70% based on age
      const hasPastConditions = Math.random() < (0.4 + ageRiskFactor * 0.3); // 40-70% based on age
      const hasAllergies = Math.random() < 0.45; // 45% have allergies
      
      const chronicIllnesses = [
        'Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Arthritis',
        'Chronic Kidney Disease', 'COPD', 'Osteoporosis', 'High Cholesterol',
        'Thyroid Disorder', 'Anemia', 'Migraine'
      ];
      const pastConditions = [
        'Pneumonia', 'Surgery', 'Fracture', 'Infection', 'Appendectomy',
        'Gallbladder Surgery', 'Hernia Repair', 'Cataract Surgery', 'Joint Replacement',
        'Heart Attack', 'Stroke', 'Cancer Treatment'
      ];
      const allergies = [
        'Penicillin', 'Latex', 'Iodine', 'Shellfish', 'Dust', 'Pollen',
        'Peanuts', 'Dairy', 'Sulfa Drugs', 'Aspirin', 'Codeine', 'Mold'
      ];
      
      const patientProfile = new PatientProfile({
        userId: user._id,
        firstname: user.firstname,
        middlename: user.middlename,
        lastname: user.lastname,
        gender: user.gender,
        birthdate: user.birthdate.toISOString().split('T')[0],
        age: age.toString(),
        civilStatus: ['Single', 'Married', 'Divorced', 'Widowed'][Math.floor(Math.random() * 4)],
        mobileNumber: `09${Math.floor(Math.random() * 90000000) + 10000000}`,
        emailAddress: user.email,
        homeAddress: 'Sample Address',
        bloodtype: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)],
        allergies: hasAllergies ? allergies[Math.floor(Math.random() * allergies.length)] : null,
        currentMedication: hasChronicIllness ? 'Prescribed medications' : null,
        pastMedicalCondition: hasPastConditions ? pastConditions[Math.floor(Math.random() * pastConditions.length)] : null,
        chronicIllness: hasChronicIllness ? chronicIllnesses[Math.floor(Math.random() * chronicIllnesses.length)] : null
      });
      
      await patientProfile.save();
      created++;
    }
  }
  
  if (created > 0) {
    console.log(`   ✅ Created ${created} patient profiles`);
  } else {
    console.log('   ℹ️  All users already have patient profiles');
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting sample data generation for analytics...\n');
  
  try {
    // Connect to MongoDB
    const connected = await connectMongoDB();
    if (!connected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }
    
    // Generate sample data
    await generateSamplePatients();
    await generateSampleAppointments();
    await generateSampleInventory();
    
    console.log('\n✅ Sample data generation completed successfully!');
    console.log('\n📊 You can now view the analytics dashboard with sample data.');
    console.log('   Go to: Predictive Analytics (Admin Dashboard)');
    
  } catch (error) {
    console.error('\n❌ Error generating sample data:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { generateSampleAppointments, generateSampleInventory, generateSamplePatients };

