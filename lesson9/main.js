var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

var init1 =function (str) {
    return +str;
};

var number = 100;

var init2 = function (str) {
    return parseInt(str);
};

var init3 = function (str) {
    return Number(str);
};



suite
    .add('test speed +str', function () {
    init1(number);
})
    .add('test speend parseInt(str)', function () {
        init2(number);
    })
    .add('test speend Number(str)', function () {
        init3(number);
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({ 'async' : true});

