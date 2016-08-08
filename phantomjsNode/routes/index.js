var express = require('express');
var router = express.Router();

/* GET home page. */


module.exports = function (app) {
  app.post('/', function (req, res) {
        var result = {
            data: {
                deltaX : 110
            },
            status : 1
        };
        console.log(result.data.deltaX);
        res.set({'Content-Type' : 'application/json'}).send(JSON.stringify(result));
  });
}