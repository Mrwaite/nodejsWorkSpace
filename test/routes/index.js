var express = require('express');
var router = express.Router();
var request = require('superagent');

/* GET home page. */


module.exports = function (app) {
    var flag = 1;
    var _this = this;
    app.get('/', function (req, res) {
      request.get('http://cnodejs.org/').end(function (err, res) {
        console.log(flag, _this, this);

      })
    });
};
