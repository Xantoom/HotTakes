// Imports
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Connexion à la base de données MongoDB
mongoose
    .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_ADDRESS}/?retryWrites=true&w=majority`)
    .then(() => console.log('La connexion à la base de données MongoDb a réussi !'))
    .catch(() => console.log('Une erreur est survenue lors de la connexion à MongoDB'));

module.exports = app;
