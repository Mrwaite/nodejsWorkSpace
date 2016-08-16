var fs = require("fs")
//下面都是casperjs对于浏览器的配置
var casper = require('casper').create({
    //clientScripts: ["jquery-2.1.3.min.js"],
    pageSettings: {
        javascriptEnabled: true,
        XSSAuditingEnabled: true,
        loadImages: true,        // The WebPage instance used by Casper will
        loadPlugins: false,         // use these settings
        userAgent: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36"
    },
    waitTimeout: 10000,
    exitOnError: false,
    httpStatusHandlers: {
        404: function () {
            console.log(404);
        }
    },
    onAlert: function (msg) {
        console.log(msg);
    },
    onError: function (self, m) {
        console.log("FATAL:" + m);
        self.exit();
    },
    onDie: function () {
        console.log('dieing');
    },
    onLoadError: function (casper, url) {
        console.log(url + ' can\'t be loaded');
    },
    onPageInitialized: function () {

    },
    onResourceReceived: function () {
        //console.log(arguments[1]['url'] + ' Received');
    },
    onResourceRequested: function () {
        //console.log(arguments[1]['url'] + ' requested');
    },
    onStepComplete: function () {
        //console.log('onStepComplete');
    },
    onStepTimeout: function () {
        console.log('timeout');
    },
    logLevel: "debug",              // Only "info" level messages will be logged
    verbose: false                  // log messages will be printed out to the console
});
casper.on('remote.message', function (msg) {
    this.log(msg, 'info');
});

var pageUrl = "http://appfortify.cn/login";
//var deltaResolveServer = "http://127.0.0.1/verify";
//定义一些内部变量
var id =(new Date()).getTime();

//pageParam后面赋值之后是包含完整图片的url数组和偏移量数组，以及缺一块的图片的url数组和偏移量数组
var pageParam = null;


casper.start(pageUrl).then(function () {
	this.viewport(1920,1080);
    this.wait(5000, function () {
        //this.echo("等待5秒以便页面充分渲染");
    });
});


casper.then(function () {
    //查看是否存在验证码模块
    if (!this.exists("#p_lock")) {
        this.echo("[-]the page didn't have a verify module");
        //this.echo(this.getPageContent());
        //exit退出pantomjs是异步的，可能在退出之前还会执行一些后续的操作
        this.exit();
    }
});

//waitFor等待直到return true然后执行next step，后面的1000是设置超时参数
casper.waitFor(function check() {

    //evaluate评估当前页面DOM上下文的表达式，里面写function，它就是这么包装的
    return this.evaluate(function () {
        //利用dom操作取得class为.gt_cut_bg_slice和.gt_cut_fullbg_slice这些标签，看是不是都有52个，就是验证有没有加载完全
        return (document.querySelectorAll('#p_lock'));//确保页面已经渲染完成，出现了背景图
    });
}, function then() {
    this.echo("[i]get the page successfully");
    //下面的正则取bg的url和每张图的位置偏移，分组匹配，捕获1,2

}, function () {
    this.echo("[-]get the page failed ");
    this.exist();
}, 10000);

//
var deltaX = 172;
var currentTrailIndex = 0;
casper.then(function () {
    if (deltaX <= 0) {
        this.echo("滑块目标位移为0:处理失败");
        this.exit();
    }
    this.echo("start ot move  " + deltaX);
    currentTrailIndex = this.evaluate(function (selector, deltaX) {
        var createEvent = function (eventName, ofsx, ofsy) {
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent(eventName, true, false, null, 0, 0, 0, ofsx, ofsy, false, false, false, false, 0, null);
            return evt;
        };
        var trailArray = [

            [[0,0,0],[0,0,15],[0,0,8],[0,0,8],[0,0,24],[0,0,16],[0,0,8],[0,0,24],[0,0,16],[0,0,16],[0,0,26],[0,0,88],[0,0,26],[0,0,100],[1,0,7],[2,0,9],[5,0,7],[10,0,9],[9,0,9],[11,0,9],[14,0,6],[15,0,10],[15,0,7],[14,0,8],[14,0,9],[13,0,9],[13,0,6],[12,0,7],[8,0,8],[0,0,10]],
            [[0,0,0],[0,0,15],[0,0,8],[0,0,8],[0,0,24],[0,0,16],[0,0,8],[0,0,24],[0,0,16],[0,0,16],[0,0,26],[0,0,88],[0,0,26],[0,0,100],[1,0,7],[2,0,9],[5,0,7],[10,0,9],[9,0,9],[11,0,9],[14,0,6],[15,0,10],[15,0,7],[14,0,8],[14,0,9],[13,0,9],[13,0,6],[12,0,7],[8,0,8],[0,0,10]],
            // 算法生成的鼠标轨迹数据，为了不至于给极验团队带来太多的麻烦，我这里就省略了，请大家谅解
        ];
        var trailIndex = Math.round(Math.random() * (trailArray.length - 1));
        var deltaArray = trailArray[trailIndex];
        console.log('当前使用轨迹路径:' + (trailIndex + 1));

        var delta = deltaX - 7;//要移动的距离,减掉7是为了防止过拟合导致验证失败
        delta = delta > 200 ? 200 : delta;
        //查找要移动的对象
        var obj = document.querySelector(selector);
        var startX = obj.getBoundingClientRect().left + 20;
        var startY = obj.getBoundingClientRect().top + 18;
        var nowX = startX;
        var nowY = startY;
        console.log("startX:" + startX);
        console.log("startY:" + startY);
        var moveToTarget = function (loopRec) {
            setTimeout(function () {
                nowX = nowX + deltaArray[loopRec][0];
                nowY = nowY + deltaArray[loopRec][1];
                //console.log(loopRec + "次移动滑块");
                obj.dispatchEvent(createEvent('mousemove', nowX, nowY));
                console.log("now at:" + obj.getBoundingClientRect().left);
                if (nowX > (startX + delta - 2)) {
                    obj.dispatchEvent(createEvent('mousemove', startX + delta, nowY));
                    obj.dispatchEvent(createEvent('mouseup', startX + delta, nowY));
                    console.log("last at:" + obj.getBoundingClientRect().left);
                } else {
                    moveToTarget(loopRec + 1);
                }
            }, deltaArray[loopRec][2]);
        };
        obj.dispatchEvent(createEvent("mousedown", startX, startY));
        moveToTarget(2);
        return trailIndex;
    }, "#p_lock", deltaX);
}).then(function () {
    /*waitUntilVisible('#p_tip',function () {
        this.echo('1');
    },function () {
        this.echo('2');
    },2000);*/
    this.evaluate(function(){
        var objDisplay = document.querySelector('#p_tip').style.display;
        if(objDisplay === 'block') {
            this.echo('success');
        }
        else {
            this.echo('false');
        }
    });
});


casper.run();
