'use strict';
var debug = require('debug')('my express app');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var routes = require('./routes/index');
var guilds = require('./routes/guilds');
var prefixes = require('./routes/prefixes');

var app = express();

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://bitter-sun-4965.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://mu--botapi.herokuapp.com/',
    issuer: 'https://bitter-sun-4965.us.auth0.com/',
    algorithms: ['RS256']
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

app.use('/', routes);
app.use(jwtCheck);
app.use('/guilds', guilds);
app.use('/prefixes', prefixes);

const not_found_err = (req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

// error handlers
// catch 404 and forward to error handler
app.use(not_found_err);



if (app.get('env') === 'development') {
    // development error handler
    // will print stacktrace
    const dev_err_handler = (err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    }
    app.use(dev_err_handler);
}
else {
    // production error handler
    // no stacktraces leaked to user
    const prod_err_handler = (err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
    app.use(prod_err_handler);
}


app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), () => {
    debug('Express server listening on port ' + server.address().port);
});
