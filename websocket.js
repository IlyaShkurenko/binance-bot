"use strict";
var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();
var symbols = [];
client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});
client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            var data = JSON.parse(message.utf8Data);
            if (!symbols.length) {
                symbols = data;
            }
            else {
                compareCurrentPriceWithPrevious(data, 0.3);
            }
        }
    });
});
client.connect('wss://fstream.binance.com/ws/!markPrice@arr@1s');
var compareCurrentPriceWithPrevious = function (currentData, percent) {
    var findType = 'long';
    var _loop_1 = function (i) {
        var currentTicker = currentData[i];
        var prevTicker = symbols[i];
        if (currentTicker.s !== prevTicker.s) {
            // @ts-ignore
            prevTicker = symbols.find(function (i) { return i.s === currentTicker.s; });
        }
        var newPercent = (currentTicker.p / prevTicker.p) * 100;
        var ticker = currentTicker.s;
        var type = '', difference = 0;
        if (newPercent > 100) {
            difference = newPercent - 100;
            type = 'long';
        }
        else if (newPercent < 100) {
            difference = 100 - newPercent;
            type = 'short';
        }
        if (difference > percent && findType === type) {
            console.log(new Date());
            console.log("".concat(ticker, ": ").concat(difference, ", prev price: ").concat(prevTicker.p, ", current price: ").concat(currentTicker.p));
        }
    };
    for (var i = 0; i < currentData.length; i++) {
        _loop_1(i);
    }
    ;
    symbols = currentData;
};
