import mongoose from 'mongoose'

const hospitalSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    adress: {type: String, required: true},
    location: {
        lat: {type: Number, required: true},
        lng:{type: Number, required: true} 
    },
    createdAt: {type: Date, default: Date.now}
});

export default mongoose.model('Hospital', hospitalSchema)