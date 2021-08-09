let mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
    title: {
        type: String,
        minlength: 1
    },
    author: String, 
    source: String,
    image: {
        type: String,
        default: 'https://airbus-h.assetsadobe2.com/is/image/content/dam/stock-and-creative/imagery/generic-press-images/space-generic-1.jpg?wid=1920&fit=fit,1&qlt=85,0'
    },
    content: {
        type: String,
        minlength: 1,
        maxlength: 20000
    },
    created: {
        type: Date,
        default: function() {
            let date = new Date();
            return date;
        }
    },
    comments: Array,
    likes: Number
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);