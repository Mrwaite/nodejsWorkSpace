
/**
 * Created by mrwaite on 16-5-10.
 */

var http = require("http");
var url = require("url");



function start (route,handle) {
    function onRequest (request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("Request for" + pathname +"received");
        route(handle,pathname,response,request);

    }
    http.createServer(onRequest).listen(8888);
    console.log("server has start");
}


exports.start = start;
