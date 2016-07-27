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
*   tatgetPage : '',
*   getNumber : 0
* }
* */

function Urls (start){
    this.startUrl = start.startUrl; //起始url
    this.page = start.urlPage;//起始的页数
    this.targetPage = start.targetPage;//其实的文章信息
    this.getNumber = start.getNumber;//对于网站爬取次数的统计
}


/*
*
* guideUrl
*
* 含有page的url进入giudeUrl，首先if分支，查看下一个page能不能爬
* and取得这个page下面的所有的topic的items数组，并记录在这个page模型下面的targetPage
* 之后再次静茹guideUrl，并进入else分支，并爬里面的信息
* */

//guideUrl
/**
*
* @param <object>  回调函数
*
* */
Urls.prototype.guideUrl = function (wojiushi) {
    console.log(wojiushi, 38);
    var startUrl = this.startUrl,
        page = this.page,
        targetPage = this.targetPage,
        _this = this;
    if(targetPage === ''){
        //TODO:取得相应url上面罗列的网址
        this.getTopic(this.page, wojiushi);

    }
    else {
        //TODO:Url.getHtml()
        this.targetPage.forEach(function (value, id, array) {
            targetPage[id] = startUrl + value;
        });
        async.mapLimit(targetPage, 5, function (OneTargetPage, callback) {
            console.log(OneTargetPage);
            request.get(OneTargetPage).end(function (err, res) {
                if (err) {
                    return wojiushi(err, null);
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

                //TODO:存入数据库
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
        }
        var $ = cheerio.load(res.text);
        var items = [];
        var titles = $('#topic_list .topic_title');
        if(titles.length) {
            titles.each(function (id, element) {
                var $element = $(element);
                items.push($element.attr('href'));
            });
            _this.targetPage = items;
            _this.guideUrl(wojiushi);
        }
        else {
            return wojiushi('finish');
        }
    });
}




