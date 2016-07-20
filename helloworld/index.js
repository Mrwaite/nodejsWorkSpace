
/**
 * Created by mrwaite on 16-5-10.
 */

var server = require("./httpServer");
var router = require("./route");
var requestHandlers = require("./requsetHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle['/show'] = requestHandlers.show;


server.start(router.route,handle);
