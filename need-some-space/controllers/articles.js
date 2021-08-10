const Article = require('../models/article');
const User = require('../models/user');
const Comment = require('../models/comment');
const uploadCtrl = require('./upload');

async function index(req, res) {

    let articles = await Article.find({});
    articles.sort((a, b) => b.createdAt - a.createdAt);
    console.log(req.user);
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
    article.originator = req.user._id;
    await article.save();
    req.user.articlesCreated.push(article._id);
    await req.user.save();

    res.redirect('/')
}

async function show(req, res) {
    let article = await Article.findById(req.params.id);
    let originator = await User.findById(article.originator);

    let comments = await Comment.where('_id').in(article.comments);

    let lastMod = article.createdAt.toISOString().slice(0, 16);

    res.render('articles/show', { article, user: req.user, lastMod, originator, comments })
}

async function edit(req, res) {
    let article  = await Article.findById(req.params.id);
    
    res.render('articles/edit', { user: req.user, article })
}

async function update(req, res) {
    console.log(req.body);
    let article  = await Article.findById(req.params.id);

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

    res.render('articles/show', { user: req.user, article, lastMod })
}

async function deleteArticle(req, res) {
    let article = await Article.findById(req.params.id);
    let user = await User.findById(req.user._id);
    if (article.originator.toString() === req.user._id.toString()) {
        let articleIdx = user.articlesCreated.indexOf(article._id);
        user.articlesCreated.splice(articleIdx, 1);
        await user.save();
        await Comment.deleteMany({ '_id': { $in: article.comments } });
        await Article.deleteOne({'_id': req.params.id});
    }
    let comments = await Comment.find({})
    console.log(user);
    console.log(comments);

    res.redirect('/');
}

module.exports = {
    index, 
    new: newArticle, 
    create, 
    show,
    edit,
    update,
    delete: deleteArticle,
}