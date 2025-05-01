import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema({
  location: {
    type: { 
      type: String, 
      enum: ['Point'], // Définir le type comme un "Point" GeoJSON
      required: true
    },
    coordinates: {
      type: [Number], // Le tableau doit être de type [longitude, latitude]
      required: true
    }
  },
  phoneNumber: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    validate: {
      validator: function(v) {
        // Accepte les numéros commençant par 0 et suivis de 9 chiffres
        return /^0\d{9}$/.test(v);
      },
      message: props => `${props.value} n'est pas un numéro de téléphone valide! Le format doit être 0XXXXXXXXX`
    }
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'completed'],
    default: 'pending'
  },
  assignedAmbulance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Emergency', emergencySchema);
