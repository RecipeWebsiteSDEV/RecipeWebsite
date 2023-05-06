const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// creating ingredient schema
const ingredientsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    potentialNames: {
        type: [String],
        required: false,
        default: []
    }
}, { timestamps: true });

// model
const Ingredients = mongoose.model('Ingredients', ingredientsSchema);
module.exports = Ingredients;