let mongoose = require('mongoose');


let articleSchema = mongoose.Schema({
    title: {
        type: String,
        minlength: 1, 
        maxlength: 60,
    },
    author: {
        type: String, 
        maxlength: 30,
    },
    source: String,
    image: {
        type: String,
        default: 'https://airbus-h.assetsadobe2.com/is/image/content/dam/stock-and-creative/imagery/generic-press-images/space-generic-1.jpg?wid=1920&fit=fit,1&qlt=85,0'
    },
    content: {
        type: String,
        minlength: 1,
        maxlength: 20000,
    },
    likes: Number,
    likedBy: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'User'
    },
    originator: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Comment'
    },
},
    {
        timestamps: true
    },
);

module.exports = mongoose.model('Article', articleSchema);