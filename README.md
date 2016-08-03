# nodejsWorkSpace
it`s my nodejs repository

express-session，connect-mongo，connect-flash ，markdown， multer

## 我的node模块备忘录

### express-session

express session中间件

### connect-mongo

mongodb的会话存储中间件

### connect-flash

闪存消息中间件

### markdown

express中间件，渲染markdown文件

### multer

文件上传


### 工具

supervisor
node-inspector
browser-sync
cmd_markdown
robomongo
nodemon

## 正向代理

客户端知道原始服务器，客户端发送并指定目标（原始服务器）， 客户端必须设置正向代理服务器，前提知道代理服务器的ip，和端口
作用

1. 访问本无法访问的服务器，
2. 加速访问服务器
3. Cache作用
4. 客户端访问授权
5. 隐藏访问者行踪

## 反向代理

客户端认为代理服务器就是原始服务器，客户端不需要进行特殊的设置，客户端发送请求之后，反向代理服务器会判断向原始服务器提交请求

作用： 

1. 保护隐藏原始资源服务器
2. 负载均衡

## 透明代理

客户端根本不需要知道有代理服务器的存在，它改编你的报文，并会传送真实的ip



