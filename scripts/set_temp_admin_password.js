
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectMongoDB, mongoose } = require('../config/mongodb');
const User = require('../models/User');

(async () => {
  try {
    console.log('ðŸ”„ Connecting to MongoDB...');
    const ok = await connectMongoDB();
    if (!ok) {
      console.error('âŒ Could not connect to MongoDB');
      process.exit(1);
    }

    const email = 'admin@test.com';
    const plainPassword = 'Admin123!';
    const hash = await bcrypt.hash(plainPassword, 10);

    const res = await User.updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          password: hash,
          status: true,
          isVerified: true
        }
      },
      { upsert: false }
    );

    console.log('Matched:', res.matchedCount, 'Modified:', res.modifiedCount);
    console.log('âœ… Temp admin password set for', email, '->', plainPassword);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('âŒ Error setting temp password:', err);
    process.exit(1);
  }
})();
