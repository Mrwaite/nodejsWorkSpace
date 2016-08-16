var express = require('express');
var router = express.Router();
var engine = require('ejs-mate');

/* GET home page. */


module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {
            what : 'best',
            who : 'me'
        });
    });
};
