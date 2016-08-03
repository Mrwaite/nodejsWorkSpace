

var Event = {
    //通过on
    on : function (eventName, callback) {
        if(typeof Event[eventName] != 'function') {
            Event[eventName] = callback;
        }
        else {
            
        }
    },
    emit : function (eventName) {
        Event[eventName]();
    }
};


Event.on('test', function (result) {
    console.log(result);
});

Event.on('test', function () {
    console.log('test')
});
Event.emit('test');