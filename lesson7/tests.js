var should = chai.should();

describe('测试斐波那契数列', function () {
    it('输入0的时候，应该输出0', function () {
        window.fibonacci(0).should.equal(0);
    });
    it('输入1的时候，应该输出1', function () {
        window.fibonacci(1).should.equal(1);
    });
})