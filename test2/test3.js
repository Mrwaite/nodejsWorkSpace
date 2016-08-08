var casper = require('casper').create();

var data, wsurl = 'http://127.0.0.1:3000/';

casper.start('http://baidu.com/', function() {
    data = this.evaluate(function(wsurl) {
        return JSON.parse(__utils__.sendAJAX('http://127.0.0.1:3000/', 'GET', null, false));
    }, {wsurl: wsurl});
});

casper.then(function() {
    require('utils').dump(data);
});

casper.run();


