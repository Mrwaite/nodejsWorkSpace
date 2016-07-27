var request = require('superagent'),
    cheerio = require('cheerio'),
    async = require('async'),
    settings = require('../setting.js'),
    find = require('cheerio-eq');

module.exports = Urls;


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
    this.startUrl = start.startUrl;//start.startUrl; //起始url
    this.page = start.urlPage;//start.page;//起始的页数
    this.targetPage = start.targetPage;//start.targetPage;//其实的文章信息
    this.getNumber = start.getNumber;
}


/*
*
* guideUrl
*
* 含有page的url进入giudeUrl，首先if分支，查看下一个page能不能爬
* and取得这个page下面的所有的topic的items数组，并记录在这个page模型下面的targetPage
* 之后再次静茹guideUrl，并进入else分支，并爬里面的信息
* */
Urls.prototype.guideUrl = function (wojiushi) {
    console.log(wojiushi, 38);
    var startUrl = this.startUrl,
        page = this.page,
        targetPage = this.targetPage,
        _this = this;
    var accessUrl;
    if(targetPage === ''){

        //this.hasNext(this.page);
        //TODO:取得相应url上面罗列的网址
        this.getTopic(this.page, wojiushi);

    }
    else {
        //TODO:Url.getHtml()
        //console.log(targetPage);
        this.targetPage.forEach(function (value, id, array) {
            targetPage[id] = startUrl + value;
        });
        //console.log(targetPage);
        async.mapLimit(targetPage, 5, function (OneTargetPage, callback) {
            //accessUrl = startUrl + OneTargetPage;
            console.log(OneTargetPage);
            request.get(OneTargetPage).end(function (err, res) {
                if (err) {
                    return wojiushi(err, null);
                    //console.log(err.stack, 62);
                }
                var $ = cheerio.load(res.text);

                //保存文章信息，一边存入数据库
                var saveInfo = {
                    title: '',
                    author: '',
                    content: ''
                };

                saveInfo.title = $('.topic_full_title').text();
                saveInfo.author = find($, '.changes span:eq(1) a').text();
                saveInfo.content = find($, '.markdown-text:eq(0)').text();

                //console.log('guideUrl', _this);
                //TODO:存入数据库

                //console.log(1);
                //console.log(save);
                //console.log(_this.startUrl);
                wojiushi(null, saveInfo, _this);
                callback(null, OneTargetPage);
            });
        });

    }
}

Urls.prototype.getTopic = function (page, wojiushi) {
    //TODO: cheerio 读取网页上的topic信息
    var _this = this;
    var  accessUrl = this.startUrl + '/?page=' + page;
    //回调函数，本来是期望在回调函数执行完之后，继续代码的执行，但是因为是异步的所以不行
    request.get(accessUrl).end(function (err, res) {
        debugger;
        if (err) {
            return wojiushi(err);
           //return next(err);
        }
        var $ = cheerio.load(res.text);
        var items = [];
        var titles = $('#topic_list .topic_title');
        if(titles.length) {
            titles.each(function (id, element) {
                var $element = $(element);
                items.push($element.attr('href'));
            });
            //console.log('getTopic', _this);
            _this.targetPage = items;
            _this.guideUrl(wojiushi);
        }
        else {
            return wojiushi('finish');
        }
    });
}


Urls.prototype.hasNext = function (page) {
    var accessUrl = this.startUrl + '/?page=' + (this.page + 1);
    var has = false;
    var start = {};
    var _this = this;

    //回调函数，会滞后处理
    request.get(accessUrl).end(function (err, res) {
        debugger;
        if(err) {
            return next(err);
        }
        var $ = cheerio.load(res.text);
        if($('#topic_list .topic_title').length){
            has = false;
        }
        else {
            has = true;
        }
        if(has) {
            page += 1;
            start = {
                startUrl : _this.startUrl,
                page : page,
                targetPage : ''
            };
            //
            // console.log('hasNext', _this);
            var NextPage = new Urls(start);
            NextPage.guideUrl();
        }
    })
}



