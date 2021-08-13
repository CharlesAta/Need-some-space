const Article = require('../models/article');
const User = require('../models/user');
const Comment = require('../models/comment');

async function create(req, res) {
    try {
        let article = await Article.findById(req.params.id);
        let user = await User.findById(req.user._id);

        let comment = new Comment(req.body);
        comment.commenter = user._id;
        comment.username = user.name;
        comment.avatar = user.avatar;
        await comment.save();

        
        
        article.comments.push(comment._id);
        await article.save();

        res.redirect(`/articles/${article._id}`);

    } catch (err) {
        console.log(err);
    }
}

async function deleteComment(req, res) {
    try {
        let article = await Article.findById(req.params.article_id);
        let comment = await Comment.findById(req.params.comment_id);

        if (comment.commenter.toString() === req.user._id.toString()) {
            let commentIdx = article.comments.indexOf(comment._id);
            article.comments.splice(commentIdx, 1);
            await article.save();
            await Comment.deleteOne({'_id': comment._id});
        }

        res.redirect(`/articles/${article._id}`);
        
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    create,
    delete: deleteComment,
}