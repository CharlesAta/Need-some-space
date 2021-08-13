let mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commenter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    username: String,
    comment: {
        type: String, 
        maxlength: 500,
    },
    avatar: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Comment', commentSchema);