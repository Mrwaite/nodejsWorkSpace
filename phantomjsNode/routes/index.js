var express = require('express');
var router = express.Router();

/* GET home page. */


module.exports = function (app) {
  app.post('/', function (req, res) {
    var result = {
        data : {
          deltaX : '17'
        }
    };
    res.send(JSON.stringify(result));
  });
    app.post('/a', function (req, res) {
        
        console.log(req.body);
    });

}