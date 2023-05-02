const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// creating user schema
const usersSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });

// model
const Users = mongoose.model('Users', usersSchema);
module.exports = Users;