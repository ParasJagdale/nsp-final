import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Officer } from '../src/models/Officer.js'; // Corrected path

const seedOfficers = async () => {
  // Ensure the MONGODB_URI is loaded
  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI is not defined in your .env file.');
    console.error('Please create a .env file in the /server directory and add your MONGODB_URI.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const officers = [
      {
        email: 'stateoffice@gmail.com',
        password: 'admin123',
        role: 'state_officer',
      },
      {
        email: 'centraloffice@gmail.com',
        password: 'admin123',
        role: 'ministry_officer',
      },
    ];

    for (const officerData of officers) {
      const existingOfficer = await Officer.findOne({ email: officerData.email });
      if (existingOfficer) {
        console.log(`🟡 Officer with email ${officerData.email} already exists. Skipping.`);
        continue;
      }

      const passwordHash = await bcrypt.hash(officerData.password, 12);
      await Officer.create({ ...officerData, passwordHash });
      console.log(`✅ Created officer: ${officerData.email}`);
    }

    console.log('\nSeeding complete!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedOfficers();