const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require("jsonwebtoken");  // Importation correcte de jsonwebtoken

const app = express();

app.use(bodyParser.json());

const corsOptions = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

const userRoutes = require('./Routes/user');
const listRoutes = require('./Routes/list');

app.use('/api/users', userRoutes);
app.use('/api/list', listRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connexion à la base de données MongoDB réussie');
    })
    .catch((err) => {
        console.error('Erreur de connexion à MongoDB', err);
        process.exit(1);
    });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});