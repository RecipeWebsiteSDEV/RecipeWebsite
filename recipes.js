const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// creating recipe schema
const recipesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dishType: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    ingredients: [{ type: String , required: true }]
}, { timestamps: true });

// model
const Recipes = mongoose.model('Recipes', recipesSchema);
module.exports = Recipes;