import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function createDefaultAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connexion Mongodb etablie")

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('✅ Admin déjà existant.');
      return;
    }

    const admin = new User({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      //hospital: null,
      //ambulance: null,
    });

    await admin.save();
    console.log(' Admin créé avec succès !');
  } catch (err) {
    console.error('Erreur lors de la création de l’admin :', err);
  } 
}
if (process.argv[1].includes('initAdmin.js')){
  createDefaultAdmin();
}

export default createDefaultAdmin;
