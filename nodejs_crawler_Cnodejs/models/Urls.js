var request = require('superagent'),
    cheerio = require('cheerio'),
    async = require('async'),
    settings = require('../setting'),
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
    this.startUrl = 'http://www.cnodejs.org',//start.startUrl; //起始url
    this.page = 1,//start.page;//起始的页数
    this.targetPage = ''//start.targetPage;//其实的文章信息
}


/*
*
* guideUrl
*
* 含有page的url进入giudeUrl，首先if分支，查看下一个page能不能爬
* and取得这个page下面的所有的topic的items数组，并记录在这个page模型下面的targetPage
* 之后再次静茹guideUrl，并进入else分支，并爬里面的信息
* */
Urls.prototype.guideUrl = function (response) {
    var startUrl = this.startUrl,
        page = this.page,
        targetPage = this.targetPage,
        _this = this;
    var accessUrl;
    if(targetPage === ''){
        accessUrl = this.startUrl + '/?page=' + this.page;
        this.hasNext(this.page);
        //TODO:取得相应url上面罗列的网址
        this.getTopic(accessUrl);

    }
    else {
        //TODO:Url.getHtml()
        debugger;
        targetPage.forEach(function (value, id, array) {
            accessUrl = startUrl + targetPage[0];

            //回调函数，本来是期望在回调函数执行完成，因为是异步的所以can`t
            request.get(accessUrl).end(function(err, res) {
                if(err) {
                    //return (err.status;
                    console.log(err.stack);
                }
                var $ = cheerio.load(res.text);

                //保存文章信息，一边存入数据库
                var saveInfo = {
                    title : '',
                    author : '',
                    content : ''
                };

                saveInfo.title = $('.topic_full_title').text();
                saveInfo.author = find($, '.changes span:eq(1) a').text();
                saveInfo.content = find($, '.markdown-text:eq(0)').text();

                //console.log('guideUrl', _this);
                //TODO:存入数据库
                console.log(saveInfo);

            });
        });

    }
}

Urls.prototype.getTopic = function (accessUrl) {
    //TODO: cheerio 读取网页上的topic信息
    var _this = this;

    //回调函数，本来是期望在回调函数执行完之后，继续代码的执行，但是因为是异步的所以不行
    request.get(accessUrl).end(function (err, res) {
        debugger;
        if (err) {
            return next(err);
           //return next(err);
        }
        var $ = cheerio.load(res.text);
        var items = [];
        $('#topic_list .topic_title').each(function (id, element) {
            var $element = $(element);
            items.push($element.attr('href'));
        });
        console.log('getTopic', _this);
        _this.targetPage =  items;
        _this.guideUrl();
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
            console.log('hasNext', _this);
            var NextPage = new Urls(start);
            NextPage.guideUrl();
        }
    })
}



