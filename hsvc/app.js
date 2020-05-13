let createError = require('http-errors');
let express = require('express');
let logger = require('morgan');
let path = require('path');
let ejs = require('ejs');
let app = express();

// ----------------------------------------------------------------------------



app.set('view engine', 'ejs');
app.set('views', `./hsvc/views`);
app.engine('html', ejs.__express);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    console.log([req._startTime.toLocaleString(), req.socket.remoteAddress || 'no ip', req.url, req.body, req.query]);
    next();
});

// ----------------------------------------------------------------------------

// static
app.use(express.static(path.join(__dirname, 'public')));

// services
app.use('/admin', require('./routes/admin'));
app.use('/bill', require('./routes/bill'));

// views
app.use('/index', require('./routes/views/index'));
app.use('/guild', require('./routes/views/guild'));
app.use('/player', require('./routes/views/player'));


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
