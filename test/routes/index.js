var express = require('express');
var router = express.Router();
var request = require('superagent');
var async = require('async');

/* GET home page. */


module.exports = function (app) {
    app.get('/', function (req, res) {

        var urls = [];
        for(var i = 0; i < 30; i++) {
            urls.push('http://www.cnodejs.org/?page=' + i);
        }
        var curCount = 0;
        var reptileMove = function(url,callback){
            //延迟毫秒数
            var delay = parseInt((Math.random() * 30000000) % 1000, 10);
            curCount++;
            console.log('现在的并发数是', curCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');

            request.get(url)
                .end(function(err,sres){
                    curCount--;
                    callback(null,url +'Call back content');
                    // sres.text 里面存储着请求返回的 html 内容
                    //var $ = cheerio.load(sres.text);
                    // 收集数据
                    // 拼接URL
                    //var currentBlogApp = url.split('/p/')[0].split('/')[3],
                        //appUrl = "http://www.cnblogs.com/mvc/blog/news.aspx?blogApp="+ currentBlogApp;
                    // 具体收集函数
                    //personInfo(appUrl);
                });

           
        };

// 使用async控制异步抓取
// mapLimit(arr, limit, iterator, [callback])
// 异步回调


// 使用async控制异步抓取
// mapLimit(arr, limit, iterator, [callback])
// 异步回调
        async.mapLimit(urls, 5 ,function (url, callback) {
            reptileMove(url, callback);
        }, function (err,result) {
            // 4000 个 URL 访问完成的回调函数

            // ...
        });

    });
};
