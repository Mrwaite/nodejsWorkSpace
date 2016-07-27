var express = require('express');
var request = require('superagent');
var cheerio = require('cheerio');
var router = express.Router();
var settings = require('../setting.js');
var Urls = require('../models/Urls');

/* GET home page. */

//爬取方式
//首先爬虫进去一个page，ex：1，然后得到包含这页所有文章的url（在这之前取page += 1的page里面执行上面一样的操作）
//之后又是一个循环，循环文章的url，循环体是得到文章的标题，作者，内容，保存到数据库


module.exports = function(app){
    app.get('/', function(req, res){
        //res.send(res)
        var startCrawler = new Urls(settings);
        //res.send(settings);
        var save = [];
        //console.log(settings);
        var callback = function (err, saveInfo, _this) {
            //res.send(_this);
            if(err == 'finish') {
                return res.send(save);
            }
            else if(err){
                return res.send(err);
            }
            else {
                save.push(saveInfo);
                _this.getNumber++;
                console.log(_this.getNumber);
                if (_this.getNumber == 40) {
                    settings.urlPage++;
                    startCrawler = new Urls(settings);
                    startCrawler.guideUrl(callback);
                };
            }
        }
        startCrawler.guideUrl(callback);


    });
};
