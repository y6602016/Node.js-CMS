const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define Schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required:true,
    },

    lastName: {
        type: String,
        required:true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required:true,
    },
});

// create model and export it
const User = mongoose.model('user', userSchema);
module.exports = User;