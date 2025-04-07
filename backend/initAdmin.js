import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/users.js';

dotenv.config();

async function createDefaultAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('✅ Admin déjà existant.');
      return;
    }

    const admin = new User({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      hospital: null,
      ambulance: null,
    });

    await admin.save();
    console.log('🎉 Admin créé avec succès !');
  } catch (err) {
    console.error('Erreur lors de la création de l’admin :', err);
  } finally {
    await mongoose.disconnect();
  }
}

createDefaultAdmin();
