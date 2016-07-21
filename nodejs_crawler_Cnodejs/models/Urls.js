var request = require('superagent'),
    cheerio = require('cheerio'),
    async = require('async'),
    fs = require('fs');

modules.exports = Urls;


/**
*
* Urls模块对象
*
* @param <object> ex: {
*   startUrl : 'http://www.cnodejs.org',
*   page : 0,
*   tatgetPage : ''
* }
* */

function Urls (start){
    this.startUrl = start.startUrl; //起始url
    this.page = start.page;//起始的页数
    this.targetPage = start.targetPage;//其实的文章信息
}


/*
*
* guideUrl
*
* 含有page的url进入giudeUrl，首先if分支，查看下一个page能不能爬
* and取得这个page下面的所有的topic的items数组，并记录在这个page模型下面的targetPage
* 之后再次静茹guideUrl，并进入else分支，并爬里面的信息
* */
Urls.prototype.guideUrl = function () {
    var startUrl = this.startUrl,
        page = this.page,
        targetPage = this.targetPage;
    var accessUrl = startUrl + '/?page=' +page;
    if(targetPage === ''){
        this.getNext(accessUrl);
        //TODO:取得相应url上面罗列的网址
        this.targetPage = this.getTopic(accessUrl);
        this.guideUrl();
    }
    else {
        //TODO:Url.getHtml()

        request.get(accessUrl).end(function(err, res) {
            if(err) {
                return next(err);
            }
            var $ = cheerio.load(res.text);

            //保存文章信息，一边存入数据库
            var saveInfo = {
                title : '',
                author : '',
                content : ''
            };

            saveInfo.title = $('.topic_full_title').text();
            saveInfo.author = $('.changes span:eq(1) a').text();
            saveInfo.content = $('.markdown-text:eq(0)').text();

            //TODO:存入数据库

        });
    }
}

Urls.prototype.getNext = function (url) {
    if(Urls.hasNext(url)) {
        var nextPage = page + 1;
    }
}

Urls.prototype.getTopic = function (accessUrl) {
    //TODO: cheerio 读取网页上的tipic信息
    request.get(accessUrl).end(function (err, res) {
        if (err) {
           return next(err);
        }
        var $ = cheerio.load(res.text);
        var items = [];
        $('.topic_title').each(function (id, element) {
            var $element = $(element);
            items.push($element.attr('href'));
        });

        return items;
    });
}



