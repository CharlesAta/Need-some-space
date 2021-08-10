var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let session = require('express-session');
let passport = require('passport');
let bb = require('express-busboy');
let methodOverride = require('method-override');

require('dotenv').config();

var app = express();


// connect to the MongoDB with mongoose
require('./config/database');
require('./config/passport');

let indexRouter = require('./routes/index');
let articlesRouter = require('./routes/articles');
let commentsRouter = require('./routes/comments');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
bb.extend(app, {
  upload: true
});
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'Project2',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', articlesRouter);
app.use('/', commentsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
