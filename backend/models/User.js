import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'hospital', 'ambulance'],
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: function() {
      return this.role === 'hospital' || this.role === 'ambulance';
    }
  },
  ambulance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambulance',
    required: function() {
      return this.role === 'ambulance';
    }
  },
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password avant sauvegarde
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Générer JWT token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id, role: this.role, hospital: this.hospital },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
};

const User = mongoose.model('User', UserSchema);
export default User;