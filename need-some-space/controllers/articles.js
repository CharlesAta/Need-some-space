function index(req, res) {
    console.log(req.user)
    res.render('articles/index', { user: req.user
    });
}

module.exports = {
    index
}