function a(n) {
    var i = Math.floor(Math.sqrt(n));
    var test1 = i * ( i + 1 );
    var test2 = (i - 1) * i;
    console.log((test1 > test2) ? i - 1 : i);
}

if (require.main === module) {
    //如果直接执行main.js,则进入此处
    //如果 main.js 被其他文件 require，则此处不执行
    var n = Number(process.argv[2]);
   a(n);
}