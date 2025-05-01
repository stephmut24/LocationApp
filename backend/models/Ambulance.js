import mongoose from 'mongoose';

const AmbulanceSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  driverEmail: {
    type: String,
    required: true,
    unique: true
  },
  driverPhone: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'maintenance'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexer la localisation pour les recherches géospatiales
AmbulanceSchema.index({ location: '2dsphere' });

const Ambulance = mongoose.model('Ambulance', AmbulanceSchema);
export default Ambulance;