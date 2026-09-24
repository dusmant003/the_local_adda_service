var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const db = require('./config/db')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload.router');
var authRouter = require('./routes/auth.router');
var adminRouter = require('./routes/admin.router');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', indexRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);





// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error('ERROR:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message
  });
});

module.exports = app;
