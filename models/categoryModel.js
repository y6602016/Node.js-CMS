const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define Schema
const categorySchema = new Schema({
    title: {
        type: String,
        required:true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
});

// create model and export it
const Category = mongoose.model('category', categorySchema);
module.exports = Category;