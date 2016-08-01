var app = require('../app');
var supertest = require('supertest');

//看下面这句话很重要，得到的request对象可以直接对照
//superagnet 的API 进行调用

var request = supertest(app);

var should = require('should');

describe('测试.js', function () {
    it('输入10， 应当返回55', function (done) {
        //mocha无法感知异步调用的完成，只有主动接受一个done参数，测试完毕自行调用，告知结束
        //mocha可以通过检测it，第二个参数的长度，就是function的长度就是参数的数量
        //比如上面传入了done，那么长度就是1，就知道有回调函数了

        request.get('/fib')
            //query用来传递参数，send可以用来传递body
            //它们都可以传Object进去
            .query({n: 10})
            .end(function (err, res) {
                //因为http传回的都是String
                //判断有没有err
                //should.not.exist(err);
                res.text.should.equal('55');
                done(err);
            });
    });
        /**
         *
         * @param <Number, Number, String, Fun> ex : 0, 200, '0', done
         * @return null
        * */
        var testFib = function (n, statusCode, expect, done) {
            request
                .get('/fib')
                .query({n : n})
                .expect(statusCode)
                .end(function (err, res) {
                    
                    res.text.should.equal(expect);
                    done(err);
                });
        }

        it('输入0，返回0',  function (done) {
            testFib(0, 200, '0', done);
        });

        it('输入1， 返回1', function (done) {
            testFib(1, 200, '1', done);
        });

        it('输入小于0的，抛错',function (done) {
            testFib(-1, 500, 'n should >= 0', done);
        });

        it('输入大于10，抛错', function (done) {
            testFib(11, 500, 'n should <= 10', done);
        });

        it('输入非数字，报错', function (done) {
            testFib('test', 500, 'n should be a number', done);
        });

    it('should status 500 when error', function (done) {
        request.get('/fib')
            .query({n: 100})
            .expect(500)
            .end(function (err, res) {
                done(err);
            });
    });


            

})