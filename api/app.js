/* Libraries */
const express = require('express');
const bodyParser =  require('body-parser');
const mongoose = require('mongoose');

/* Application files */
const usersRoutes = require('./routes/users-routes');
const productRoutes = require('./routes/products-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/users', usersRoutes);

app.use('/api/products', productRoutes)

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500).json({ message: error.message || 'An unknown error occured!' });
});

// Establishes connection to MongoDB database
mongoose
    .connect('mongodb+srv://slavicayarns:6VAtcBjvvHe6rMpB@buffout-dev.20mcd.mongodb.net/buffout-dev?retryWrites=true&w=majority&appName=Buffout-dev')
    .then(app.listen(3000))
    .catch(err => console.log(err));
 