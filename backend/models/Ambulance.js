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
  status: {
    type: String,
    enum: ['available', 'busy', 'maintenance'],
    default: 'available'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
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
