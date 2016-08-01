var express = require('express');
var router = express.Router();

/* GET home page. */


module.exports = function (app) {
  app.get('/fib', function (req, res) {
    // http 传来的东西默认都是没有类型的，都是 String，所以我们要手动转换类型
    var n = Number(req.query.n);
    try {
      //为何使用String做类型转换，因为如果你直接给一个数字给res.send的话
      //它会当成你给他一个http状态码，所以我们明确的给String
      res.send(String(fibonacii(n)));
    } catch (e) {
      //如果fibonacci抛错的话，错误的信息会记录在err对象的。message属性中
      res
          .status(500)
          .send(e.message);
    }
  });

  var fibonacii = function (n) {
    if (n < 0) {
        throw new Error('n should >= 0');
      }
    if (n > 10) {
      throw new Error('n should <= 10');
    }

    //当你通过supertest传值‘test’过来的时候，Number('test')为NaN也是数值的一种，所以还要另作判断
    if (typeof n !== 'number' || isNaN(n)) {
      throw new Error('n should be a number');
    }
    if(n === 0) {
        return 0;
    }
    if (n === 1) {
      return 1;
    }
    return fibonacii(n - 1) + fibonacii(n - 2);
  };
};
