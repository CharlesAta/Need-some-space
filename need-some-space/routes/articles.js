var express = require('express');
var router = express.Router();
const articlesCtrl = require('../controllers/articles')

router.get('/', articlesCtrl.index);
router.get('/articles/new', isLoggedIn, articlesCtrl.new);
router.get('/articles/:id', articlesCtrl.show)
router.post('/articles', isLoggedIn, articlesCtrl.create);

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/auth/google');
}

module.exports = router;
