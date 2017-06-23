'use strict';


const Dispatcher = require('./dispatcher.js');

let id;

Dispatcher.register(function (payload) {
    console.log('Func1', payload);
});

Dispatcher.register(function (payload) {
    Dispatcher.waitFor([id]);
    console.log('Func2', payload);
});

id = Dispatcher.register(function (payload) {
    console.log('Func3', payload);
});


Dispatcher.dispatch({type: 'TEST', value: 'Hello, World!'});
