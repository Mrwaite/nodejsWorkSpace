var express = require('express');
var request = require('superagent');
var cheerio = require('cheerio');
var router = express.Router();
var settings = require('../setting.js');
var Urls = require('../moderls/Urls');

/* GET home page. */

//爬取方式
//首先爬虫进去一个page，ex：1，然后得到包含这页所有文章的url（在这之前取page += 1的page里面执行上面一样的操作）
//之后又是一个循环，循环文章的url，循环体是得到文章的标题，作者，内容，保存到数据库


module.exports = function(app){
    app.get('/', function(req, res){

        //创建Urls实例
        var startCrawler = new Urls(settings);

        //存储爬虫爬取到的信息
        var save = [];

        //guideUrl的回调函数，每次爬取到数据都会返回
        var callback = function (err, saveInfo, _this) {

            //如果err返回的是‘finish’,表示cnodejs页面已经爬取完
            if(err == 'finish') {
                return res.send(save);
            }
            else if(err){
                return res.send(err);
            }
            else {
                save.push(saveInfo);
                _this.getNumber++;
                //console.log(_this.getNumber);
                //当一个页面上面的topic爬取完，就进行下个页面的爬取
                //创建一个新的实例，用于下个页面的 爬取
                if (_this.getNumber == 40) {
                    settings.urlPage++;
                    startCrawler = new Urls(settings);
                    startCrawler.guideUrl(callback);
                };
            }
        }

        //第一个页面的爬取
        startCrawler.guideUrl(callback);
    });
};
