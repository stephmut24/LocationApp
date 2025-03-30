import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: { type: String, enum: ['admin', 'hospitalManager', 'ambulanceDriver'], required: true},

    hospitalId: {type: mongoose.Schema.Types.ObjectId, ref: 'Hospital'},

    createdAt: {type: Date, defaut: Date.now}
})



export default mongoose.model('User', userSchema)