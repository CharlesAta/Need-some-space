const Article = require('../models/article');
const User = require('../models/user');
const uploadCtrl = require('./upload');

async function index(req, res) {
    console.log(req.user);

    let articles = await Article.find({});

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

    if (Object.keys(req.files).length !== 0 && req.files.constructor === Object) {
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
    let lastMod = article.createdAt.toISOString().slice(0, 16);

    res.render('articles/show', { article, user: req.user, lastMod })
}

async function edit(req, res) {
    let article  = await Article.findById(req.params.id);
    
    res.render('articles/edit', { user: req.user, article })
}

async function update(req, res) {
    let article  = await Article.findById(req.params.id);

    console.log("looking into update", article)
    console.log("looking into update re bod", req.body)
    if (!req.body.author) {
        article.author = req.user.name;
    } else {
        article.author = req.body.author;
    }

    if (Object.keys(req.files).length !== 0 && req.files.constructor === Object && !article.image) {
        article.image = await uploadCtrl.upload(req);
    }

    article.title = req.body.title;
    article.source = req.body.source;
    article.content = req.body.content;

    await article.save();

    let lastMod = article.updatedAt.toISOString().slice(0, 16);

    console.log(article);

    res.render('articles/show', { user: req.user, article, lastMod })
}

module.exports = {
    index, 
    new: newArticle, 
    create, 
    show,
    edit,
    update, 
}