const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });

      console.log('✅ Default Admin created: admin@gmail.com / admin123');
    } else {
      // Ensure the password is correct even if account exists
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      adminExists.password = hashedPassword;
      await adminExists.save();
      console.log('ℹ️ Admin account updated to default: admin@gmail.com / admin123');
    }
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
  }
};

module.exports = seedAdmin;
