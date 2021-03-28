const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define Schema
const commentSchema = new Schema({
    body: {
        type: String,
        required:true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },

    date: {
        type:Date,
        default: Date.now(),
    },

    commentIsApproved: {
        type: Boolean,
        default: false,
    }
});

// create model and export it
const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;