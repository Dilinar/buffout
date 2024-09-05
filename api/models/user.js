// This model defines the data structure of users. It also defines the connection to the MongoDB database.

/* Libraries */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    products: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Product' }],
    workouts: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Workout' }],
    goals: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Goal' }]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
