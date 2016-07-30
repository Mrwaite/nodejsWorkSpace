var main = require('../main');
var should = require('should');

describe('斐波那契函数测试', function () {
    it('当 n === 0 时，返回 0 ', function () {
        main.fibonnacci(0).should.equal(0);
    });
    
    it('当 n === 1 时，返回 1', function () {
        main.fibonnacci(1).should.equal(1);
    });
    
    it('当 n > 1 时 ， 返回正确的数值', function () {
        main.fibonnacci(10).should.equal(55);
    });
    
    it('当 n > 10 时 ， 抛出错误', function () {
        (function () {
          main.fibonnacci(11);
        }).should.throw('n should <= 10');
    });

    it('当 n < 0 时 ，抛出错误', function () {
        (function () {
            main.fibonnacci(-1);
        }).should.throw('n should >= 0');
    });

    it('当 n 不是数字的时候，应该抛出错误', function () {
        (function () {
            main.fibonnacci('测试');
        }).should.throw('n should be a Number');
    });
});

