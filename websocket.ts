const WebSocketClient = require('websocket').client;
const client = new WebSocketClient();
let symbols: { s: string, p: number, P: number }[]  = []

client.on('connectFailed', function(error: any) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection:any) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error:any) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message:any) {
        console.log(new Date())
        if (message.type === 'utf8') {
            const data = JSON.parse(message.utf8Data)
            if(!symbols.length) {
                symbols = data;
            } else {
                compareCurrentPriceWithPrevious(data, 0.3)
            }
        }
    });
});
client.connect('wss://fstream.binance.com/ws/!markPrice@arr@1s');

const compareCurrentPriceWithPrevious = (currentData: { s: string, p: number, P: number }[], percent: number) => {
    const findType = 'long';
    for(let i = 0; i < currentData.length; i++) {
        const currentTicker = currentData[i];
        let prevTicker = symbols[i];
        if(currentTicker.s !== prevTicker.s) {
            // @ts-ignore
            prevTicker = symbols.find(i => i.s === currentTicker.s)
        }
        const newPercent = (currentTicker.p / prevTicker.p) * 100;
        const ticker = currentTicker.s;
        let type: string = '', difference: number = 0;
        if(newPercent > 100) {
            difference = newPercent - 100;
            type = 'long'
        } else if(newPercent < 100) {
            difference = 100 - newPercent;
            type = 'short';
        }
        if(difference > percent && findType === type) {
            const date = new Date()
            console.log(`${ticker}: ${difference}, prev price: ${prevTicker.p}, current price: ${currentTicker.p}, date: ${date.getSeconds()}, ${date.getMilliseconds()}`)
        }
    };
    symbols = currentData;
}
