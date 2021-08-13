const Article = require('../models/article');
const User = require('../models/user');
const Comment = require('../models/comment');
const uploadCtrl = require('./upload');

const axios = require('axios');

const nasaAPOD_rootURL = 'https://api.nasa.gov/planetary/apod?api_key=';

async function index(req, res) {
    try {
        let nasaData = await getNasaAPOD();
        let articles = await Article.find({});
        articles.sort((a, b) => b.createdAt - a.createdAt);
        res.render('articles/index', { 
        user: req.user, 
        articles, 
        nasaData,
        index: true,
        page: "Home"
    });
    
    } catch (err) {
        console.log(err);
    }
}

function newArticle(req, res) {
    res.render('articles/new', { user: req.user, page: "Create New Article"});
}

async function create(req, res) {
    try {
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

        res.redirect('/');

    } catch (err) {
        console.log(err);
    }
}

async function show(req, res) {
    try {
        let article = await Article.findById(req.params.id);
        let originator = await User.findById(article.originator);

        let comments = await Comment.where('_id').in(article.comments);

        let lastMod = article.createdAt.toISOString().slice(0, 16);

        res.render('articles/show', { article, user: req.user, lastMod, originator, comments, page: "Article" });

    } catch (err) {
        console.log(err)
    }
}

async function edit(req, res) {
    try {
        let article  = await Article.findById(req.params.id);
        
        res.render('articles/edit', { user: req.user, article, page: "Edit Article" });

    } catch (err) {
        console.log(err);
    }
}

async function update(req, res) {
    try {
        let article  = await Article.findById(req.params.id);
        let originator = await User.findById(article.originator);
        let comments = await Comment.where('_id').in(article.comments);

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

        res.render('articles/show', { user: req.user, article, lastMod, originator, comments, page: "Update Article" });

    } catch (err) {
        console.log(err);
    }
}

async function deleteArticle(req, res) {
    try {
        let article = await Article.findById(req.params.id);
        let user = await User.findById(req.user._id);
        if (article.originator.toString() === req.user._id.toString()) {
            let articleIdx = user.articlesCreated.indexOf(article._id);
            user.articlesCreated.splice(articleIdx, 1);
            await user.save();
            await Comment.deleteMany({ '_id': { $in: article.comments } });
            await Article.deleteOne({'_id': req.params.id});
        }

        res.redirect('/');

    } catch (err) {
        console.log(err);
    }
}

async function like(req, res) {
    try {
        const action = req.body.action;
        const counter = action === 'Like' ? 1 : -1;
        let article = await Article.findById(req.params.id);
        if (article.likedBy.indexOf(req.user._id) === -1) {
            await Article.update({_id: req.params.id},
                {$inc: {likes: counter}, $addToSet: {likedBy: req.user._id}},
                {})
                console.log("Liked", await Article.findById(req.params.id))
        } else {
            await Article.update({_id: req.params.id},
                {$inc: {likes: counter}, $pull: { likedBy: req.user._id}},
                {})
            console.log("Unliked", await Article.findById(req.params.id))
        }

        res.send('');

    } catch (err) {
        console.log(err);
    }
}

async function getNasaAPOD() {
    try {
        let nasaData = await axios.get(`${nasaAPOD_rootURL}${process.env.NASA_API_KEY}`)
        return nasaData.data;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    index, 
    new: newArticle, 
    create, 
    show,
    edit,
    update,
    delete: deleteArticle,
    like,
}