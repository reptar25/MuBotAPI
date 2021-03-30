'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    //res.redirect('guilds');
    res.render('index', { title: 'Mu Bot API' });
});

module.exports = router;
