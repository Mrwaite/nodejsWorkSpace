## 前言

简单的爬行cnodejs社区内容爬虫的实现

**爬取方式**

n = 0
while(hasNext(n)){
    getNext(n);
    n += 1;
}

getNext(n){
    //1. 得到page=n的网页
    //2. $('class'),得到当前页的文章列表topic[]
    //3.while('下标'==topic.length) 
    //  getTopic(topic[url])
    //
}

getTopic(url){
    //1. 利用url得到每个url的html文档
    //2. 利用cherrio提取相应的内容，放入数据库
}

//提取模块

**urls模块**
+ urls.prototype.next() //前往下一页爬取
+ urls.prototype.hasNext() //查看当前页是否有下一页
+ urls.prototype.getTopic() //前往参数url的网页爬取内容
+ urls.prototype.getTitle() //得到topic的标题
+ urls.prototype.getAutor() //得到topic的作者
+ url.prototype.getContent() //得到topic的内容，上面的三个可以合到一个
+ url.prototype.save() //保存到数据库

**什么时候用prototype,什么时候不用prototype?**

url.save是这个方法下面用到的子类的数据是没有区别的
url.prototype.save这个通常伴随着，改写父类的属性，方法，然后依据不同的子类的情况再做处理



## node modlue

### superagent

Super Agent is light-weight progressive ajax API

```
var request = require('superagent');
request.end(function(){});
```
.end里面的参数arguments的结构为
```
{
    0 ： null //估计为err信息
    1 ： {
             header : {} // 返回的头部信息
             headers : {} // 同上
             req ： {}      // 返回的客户端请求信息
             request ： {} //    同上
             res ： {} // 上面请求之后返回的信息
             status ：  // 状态码
             text ：  //返回的文本信息 ，感觉和res.text差不多
             type :  //返回的格式，ex 'text/html'
         } //response信息，挑比较重要的罗列
}
```

### async  

由于nodejs的异步架构的实现方法，对于需要同步的业务逻辑，就可以用async来解决问题

