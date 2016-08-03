var express = require('express');
var router = express.Router();

/* GET home page. */


module.exports = function (app) {
  app.post('/', function (req, res) {
        var fullbgSrcArray = req.body.fullbgSrcArray;
        var fullbgPositionArray = req.body.fullbgPositionArray;
        var bgSrcArray = req.body.bgSrcArray;
        var bgPositionArray = req.body.bgPositionArray;
        

  });
}