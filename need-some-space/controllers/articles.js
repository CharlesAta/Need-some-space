const Article = require('../models/article');
const User = require('../models/user');
const uploadCtrl = require('./upload');

async function index(req, res) {
    console.log(req.user);

    let articles = await Article.find({});
    console.log(articles)

    res.render('articles/index', { 
        user: req.user, 
        articles
    });
}

function newArticle(req, res) {
    res.render('articles/new', { user: req.user });
}

async function create(req, res) {
    if (!req.body.author) {
        req.body.author = req.user.name;
    }    
    console.log(req.files)
    if (Object.keys(req.files).length !== 0 && req.files.constructor === Object) {
        console.log("I am being seen")
        req.body.image = await uploadCtrl.upload(req);
    }

    let article  = new Article(req.body);
    await article.save();
    req.user.articlesCreated.push(article._id);
    await req.user.save();

    console.log(article);
    console.log(req.user);

    res.redirect('/')
}

async function show(req, res) {
    let article = await Article.findById(req.params.id);
    let lastMod = article.created.toISOString().slice(0, 16);;

    res.render('articles/show', { article, user: req.user, lastMod })
}

module.exports = {
    index, 
    new: newArticle, 
    create, 
    show,
}