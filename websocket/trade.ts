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
        //console.log(new Date())
        if (message.type === 'utf8') {
            const data = JSON.parse(message.utf8Data)
            //console.log(data.p + ' ' + new Date(data.E) + ' ' + data.E)
            compareCurrentPriceWithPrevious(data, 0.1)
        }
    });
});

const symbolLastPrices: any = {
    ETHUSDT: []
}
Object.keys(symbolLastPrices).forEach(symbol => {
    client.connect(`wss://fstream.binance.com/ws/${symbol.toLowerCase()}@aggTrade`);
})

const compareCurrentPriceWithPrevious = (currentData: { s: string, p: string, E: number }, percent: number) => {
    const findType = 'long';
    let currentTicker = symbolLastPrices[currentData.s];
    const symbolObj = {
        price: parseFloat(currentData.p),
        second: (new Date(currentData.E)).getSeconds()
    }
    currentTicker.push(symbolObj);
    const firstPriceObj = currentTicker[0];
    if(symbolObj.second - firstPriceObj.second > 1) {
        currentTicker = currentTicker.filter((i:any) => i.second !== firstPriceObj.second);
        symbolLastPrices[currentData.s] = currentTicker;
    }
    //check last one, minimal by current second, close last second
    if(currentTicker.length > 1) {
        const calculatePercent = (prevPrice: number, currentPrice: number, functionType: string) => {
            const newPercent = (prevPrice / currentPrice) * 100;
            const ticker = currentData.s;
            let type: string = '', difference: number = 0;
            if(newPercent > 100) {
                difference = newPercent - 100;
                type = 'long'
            } else if(newPercent < 100) {
                difference = 100 - newPercent;
                type = 'short';
            }
            //console.log(difference)
            //console.log(difference)
            if(difference > percent && findType === type) {
                const date = new Date()
                console.log(`${functionType}, ${ticker}: ${difference}, prev price: ${prevPrice}, current price: ${currentPrice}, date: ${date.getSeconds()}, ${date.getMilliseconds()}`)
            }
        }
        const currentValue = currentTicker[currentTicker.length - 1];
        const checkDiffCurrAndPrev = () => {
            const prevValue = currentTicker[currentTicker.length - 2]
            calculatePercent(prevValue.price, currentValue.price, 'checkDiffCurrAndPrev')
        }
        const checkDiffCurrAndPrevSecond = () => {
            const prevSecondPrice = [...currentTicker.filter((i:any) => i.second !== currentValue.second)].pop() //without current element;
            if(prevSecondPrice) {
                calculatePercent(prevSecondPrice.price, currentValue.price, 'checkDiffCurrAndPrevSecond')
            }
        }
        const checkDiffCurrAndCurrMinSec = () => {
            const currentSecondPrices = [...currentTicker.filter((i:any) => i.second === currentValue.second)] //without current element;
            currentSecondPrices.pop();
            // @ts-ignore
            if(currentSecondPrices.length) {
                const minimalValue = currentSecondPrices.reduce(function(prev:any, curr:any) {
                    return prev.price < curr.price ? prev : curr;
                });
                calculatePercent(minimalValue.price, currentValue.price, 'checkDiffCurrAndCurrMinSec')
            }
        };
        checkDiffCurrAndPrev();
        checkDiffCurrAndCurrMinSec();
        checkDiffCurrAndPrevSecond();
    }
}
