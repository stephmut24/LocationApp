import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Les options ne sont plus nécessaires dans les nouvelles versions de mongoose
    });

    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur de connexion à la base de données: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;