var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');

// ----------------------------------------------------------------------------


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    console.log([req._startTime.toLocaleString(), req.socket.remoteAddress || 'no ip', req.url, req.body, req.query]);
    next();
});


// ----------------------------------------------------------------------------
// services

app.use('/admin', require('./routes/admin'));
app.use('/bill', require('./routes/bill'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.end('error');

    if (err.status != 404) {
        console.error(err);
    } else {
        console.error("Not Found Page");
    }
});


// ----------------------------------------------------------------------------
module.exports = app;
