const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define Schema
const postSchema = new Schema({
    title: {
        type: String,
        required:true,
    },

    description: {
        type: String,
        required: true,
    },

    creationDate: {
        type: Date,
        default: Date.now(),
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
    },

    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
    allowComments: {
        type: Boolean,
        default: false,
    },

    file: {
        type: String,
        default: '',
    }
});

// create model and export it
const Post = mongoose.model('post', postSchema);
module.exports = Post;