const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define Schema
const categorySchema = new Schema({
    title: {
        type: String,
        required:true,
    },
});

// create model and export it
const Category = mongoose.model('category', categorySchema);
module.exports = Category;