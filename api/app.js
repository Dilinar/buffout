/* Libraries */
const fs = require('fs');
const express = require('express');
const bodyParser =  require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

/* Application files */
const usersRoutes = require('./routes/users-routes');
const productsRoutes = require('./routes/products-routes');
const workoutsRoutes = require('./routes/workouts-routes');
const goalsRoutes = require('./routes/goals-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes)
app.use('/api/workouts', workoutsRoutes);
app.use('/api/goals', goalsRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500).json({ message: error.message || 'An unknown error occured!' });
});

// Establishes connection to MongoDB database
mongoose
    .connect(`mongodb+srv://slavicayarns:vTsEFfxkiCXHpvUH@buffout.20mcd.mongodb.net/Buffout-dev?retryWrites=true&w=majority&appName=Buffout`)
    .then(app.listen(3000))
    .catch(err => console.log(err));
 