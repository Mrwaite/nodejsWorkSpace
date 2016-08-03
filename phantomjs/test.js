//var utils = require('utils');
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
/*casper.on('remote.message', function (msg) {
    this.log(msg, 'info');
});*/

var pageUrl = "http://user.geetest.com/login?url=http:%2F%2Faccount.geetest.com%2Freport";//casper.cli.get(0);//传进来的页面url
var deltaResolveServer = "http://localhost:3000/"//casper.cli.get(1);//就是传偏移量之后处理的后台的地址
//定义一些内部变量
var id =(new Date()).getTime();

//pageParam后面赋值之后是包含完整图片的url数组和偏移量数组，以及缺一块的图片的url数组和偏移量数组
var pageParam = null;


//请求页面，等待（同步，不是异步）5秒渲染
casper.start(pageUrl).then(function () {
    this.wait(5000, function () {
        //this.echo("等待5秒以便页面充分渲染");
    });
});


casper.then(function () {
    //查看是否存在验证码模块
    if (!this.exists(".gt_slider_knob")) {
        this.echo("页面中不存在极验验证码模块");
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
        return (document.querySelectorAll('.gt_cut_bg_slice').length == 52) && (document.querySelectorAll('.gt_cut_fullbg_slice').length == 52);//确保页面已经渲染完成，出现了背景图
    });
}, function then() {
    this.echo("页面渲染成功!");
    //下面的正则取bg的url和每张图的位置偏移，分组匹配，捕获1,2
    var styleReg = new RegExp("background-image: url\\((.*?)\\); background-position: (.*?);");
    var fullbgSrcArray = [];//src数组，就是完整图片的52个图片的src数组
    var fullbgCoordinateArray = [];//偏移数组，完整图片的52张图片的偏移量数组
    var fullbgSliceArray = this.getElementsAttribute('.gt_cut_fullbg_slice', 'style');//用dom操作取class为.gt_cut_fullbg_slice，就是是完整图片52张图片的style值，src和偏移量都挡在里面
    //this.echo(fullbgSliceArray);
    //下面两个for循环得到页面两张图分别的src数组，和偏移数组，push为添加进数组的方法
    for (var i = 0; i < fullbgSliceArray.length; i++) {
        var result = styleReg.exec(fullbgSliceArray[i]);//exec为循环正则匹配的方法
        if (result != null) {
            fullbgSrcArray.push(result[1]);
            fullbgCoordinateArray.push(result[2]);
        } else this.echo(fullbgSliceArray[i]);
    }
    var bgSrcArray = [];
    var bgCoordinateArray = [];
    var bgSliceArray = this.getElementsAttribute('.gt_cut_bg_slice', 'style');
    for (var i = 0; i < bgSliceArray.length; i++) {
        var result = styleReg.exec(bgSliceArray[i]);
        if (result != null) {
            bgSrcArray.push(result[1]);
            bgCoordinateArray.push(result[2]);
        }
    }
    var data = {};
    data.fullbgSrcArray = fullbgSrcArray;
    data.fullbgPositionArray = fullbgCoordinateArray;
    data.bgSrcArray = bgSrcArray;
    data.bgPositionArray = bgCoordinateArray;
    data.itemWidth = 10;//每个小块的宽度（像素）
    data.itemHeight = 58;//每个小块的高度（像素），我看网站说图片的高度是50%？
    data.lineItemCount = 26;//拼图中每行包含的小图片个数
    pageParam = data;
    fs.write('object.json', JSON.stringify(pageParam), 'w');
    //this.echo(pageParam);

}, function () {
    this.echo("等待渲染超时！");
    this.exist();
}, 10000);

//
var deltaX = 0;
casper.then(function () {
    if (pageParam == null) {
        this.echo("收集图片参数失败!");
        //this.echo(this.getPageContent());
        this.exit();
    }
    this.echo("开始请求滑块位置");
    /**
     * @param url <string> 为发送请求的url
     * @param para <json> 上面的获取的fullbg 和 bg 分别52张图片的src和偏移量数组
    * */
    //把返回的计算出来的鼠标需要按住向x轴偏移量复制给result
    var result = casper.evaluate(function (url, param) {
        return JSON.parse(__utils__.sendAJAX(url, 'POST', param, false));//__utils__.sendAJAX发送ajax请求，ajax请求求解滑块位置
    }, deltaResolveServer, {"params": JSON.stringify(pageParam)});//JSON.stringify转化为json格式
    if (result != null && result.status == 1) {
        //随后result赋值给deltaX
        deltaX = result.data.deltaX;
        this.echo("滑块位置求解成功:" + JSON.stringify(result.data));
    }
    else {
        this.echo("请求滑块位置失败:" + JSON.stringify(result));
        this.exit();
    }
});

var currentTrailIndex = 0;
casper.then(function () {
    if (deltaX <= 0) {
        this.echo("滑块目标位移为0:处理失败");
        this.exit();
    }
    this.echo("开始移动滑块,目标位移为  " + deltaX);
    currentTrailIndex = this.evaluate(function (selector, deltaX) {
        //createEvent功能：创建dom的鼠标模拟事件
        var createEvent = function (eventName, ofsx, ofsy) {
            //创建dom的鼠标模拟事件
            var evt = document.createEvent('MouseEvents');
            //传入的eventName为事件名称，ofsx：x偏移量，ofsy：y偏移量
            evt.initMouseEvent(eventName, true, false, null, 0, 0, 0, ofsx, ofsy, false, false, false, false, 0, null);
            return evt;
        };
        var trailArray = [
            // 算法生成的鼠标轨迹数据，为了不至于给极验团队带来太多的麻烦，我这里就省略了，请大家谅解
        ];
        var trailIndex = Math.round(Math.random() * (trailArray.length - 1));
        var deltaArray = trailArray[trailIndex];
        console.log('当前使用轨迹路径:' + (trailIndex + 1));

        var delta = deltaX - 7;//要移动的距离,减掉7是为了防止过拟合导致验证失败
        delta = delta > 200 ? 200 : delta;
        //查找要移动的对象，selector为鼠标拖动的控件
        var obj = document.querySelector(selector);
        //obj.getBoundingClientRect()取得，控件的详细x，y位置，加上20和18就是上移的那个图片的位置了
        var startX = obj.getBoundingClientRect().left + 20;
        var startY = obj.getBoundingClientRect().top + 18;
        var nowX = startX;
        var nowY = startY;
        console.log("startX:" + startX);
        console.log("startY:" + startY);
        //moveToTarget就是让鼠标移动的函数
        var moveToTarget = function (loopRec) {
            setTimeout(function () {
                nowX = nowX + deltaArray[loopRec][0];
                nowY = nowY + deltaArray[loopRec][1];
                //console.log(loopRec + "次移动滑块");
                //
                obj.dispatchEvent(createEvent('mousemove', nowX, nowY));
                console.log("当前滑块位置:" + obj.getBoundingClientRect().left);
                if (nowX > (startX + delta - 2)) {
                    obj.dispatchEvent(createEvent('mousemove', startX + delta, nowY));
                    obj.dispatchEvent(createEvent('mouseup', startX + delta, nowY));
                    console.log("最终滑块位置:" + obj.getBoundingClientRect().left);
                } else {
                    moveToTarget(loopRec + 1);
                }
            }, deltaArray[loopRec][2]);
        };
        obj.dispatchEvent(createEvent("mousedown", startX, startY));
        moveToTarget(2);
        return trailIndex;
    }, ".gt_slider_knob", deltaX);
}).then(function () {
    casper.waitForSelectorTextChange('.gt_info_type', function () {
        var status = this.fetchText('.gt_info_type');
        this.echo("验证结果:" + status);
        this.capture(status.replace(":","_")+ id + "_" + currentTrailIndex + '.png');//对当前页面进行截图以便复查
        if (status.indexOf("通过") > -1) {
            if (this.exists('#verify')) {
                this.click("#verify");
                this.echo("点击成功");
            }
        }
    }, function () {
        this.echo("等待滑块移动超时！");
    }, 10000);
});


casper.run();