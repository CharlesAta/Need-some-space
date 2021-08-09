let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    articlesCreated: Array, 
    googleId: String,
    avatar: String
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);