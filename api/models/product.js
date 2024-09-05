// This model defines the data structure of products. It also defines the connection to the MongoDB database.

/* Libraries */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    protein: { type: String, required: true },
    calories: { type: String, required: true },
    price: { type: String, required: true },
    caloriesPerProtein: { type: Number, required: true },
    priceOfProtein: { type: Number, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Product', productSchema);
