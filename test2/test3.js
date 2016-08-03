var casper = require('casper').create();
var utils = require('utils');

var data, wsurl = 'http://localhost:3000/';

casper.start('http://baidu.com/', function() {
    data = this.evaluate(function(wsurl) {
        return JSON.parse(__utils__.sendAJAX('http://localhost:3000/', 'post', null, false));
    });
    this.echo(data);

});

casper.run();

