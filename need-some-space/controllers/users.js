let User = require('../models/user');
let Article = require('../models/article');

async function show(req, res){
    let user = await User.findById(req.user._id);
    let articles = await Article.where('_id').in(user.articlesCreated);
    articles.sort((a, b) => b.createdAt - a.createdAt);
    res.render('users/show', { user, articles })
}

module.exports = {
    show,
}