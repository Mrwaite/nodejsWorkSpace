var express = require('express');
var request = require('superagent');
var cheerio = require('cheerio');
var router = express.Router();
var settings = require('../setting');
var Urls = require('../models/Urls');

/* GET home page. */

//爬取方式
//首先爬虫进去一个page，ex：1，然后得到包含这页所有文章的url（在这之前取page += 1的page里面执行上面一样的操作）
//之后又是一个循环，循环文章的url，循环体是得到文章的标题，作者，内容，保存到数据库


module.exports = function(app){
    app.get('/', function(req, res){
        var startCrawler = new Urls();
        console.log(settings);
        startCrawler.guideUrl();
    });
};
