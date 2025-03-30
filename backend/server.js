import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import { default as adminRoutes } from './routes/adminRoutes.js';



dotenv.config();

const app =  express()

const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json())

//connexion a MongoDB

connectDB();

//Routes
app.use('/api/admin', adminRoutes)

//Route test
app.get('/', (req, res) =>{
    res.send('API MERN fonctionne !')
})


//Demarrer le serveur
app.listen(PORT,() => {
    console.log(`Serveur en ecoute sur le port ${PORT}`)
})