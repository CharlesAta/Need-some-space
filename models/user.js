let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    articlesCreated: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Article'
    }, 
    googleId: String,
    avatar: String
}, 
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);