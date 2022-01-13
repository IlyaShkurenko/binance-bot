import {BinanceBot, getBinanceConfig, getSymbolsData} from "../bot";
const fs = require('fs');

const WebSocketClient = require('websocket').client;

let symbolLastPrices: any = {
    "DUSKUSDT": [],
    "ETHUSDT": []
}

let positionType: string;

let bot: any;
const openPositions: string[] = [];
let connections = 0;
let maxDifference = 0;
getBinanceConfig().then(async data => {
    bot = new BinanceBot(data);
    positionType = data.positionType;
    symbolLastPrices = await getSymbolsData();
    Object.keys(symbolLastPrices).forEach(symbol => {
        try {
            const client = new WebSocketClient();

            client.on('connectFailed', function(error: any) {
                console.log('Connect Error: ' + error.toString());
            });

            client.on('connect', function(connection:any) {
                console.log('WebSocket Client Connected');
                connections++;
                console.log(connections)
                connection.on('error', function(error:any) {
                    console.log(error)
                    //console.log("Connection Error: " + error.toString());
                });
                connection.on('close', function() {
                    console.log('echo-protocol Connection Closed');
                });
                connection.on('message', function(message:any) {
                    //console.log(new Date())
                    if (message.type === 'utf8') {
                        const data = JSON.parse(message.utf8Data)
                        //console.log(data.p + ' ' + new Date(data.E) + ' ' + data.E)
                        compareCurrentPriceWithPrevious(data, 0.35)
                    }
                });
            });
            client.connect(`wss://fstream.binance.com/ws/${symbol.toLowerCase()}@aggTrade`);
        } catch (e) {
            console.log(symbol)
        }
    })
})

const compareCurrentPriceWithPrevious = async (currentData: { s: string, p: string, E: number }, percent: number) => {
    let currentTicker = symbolLastPrices[currentData.s];
    const symbolObj = {
        symbol: currentData.s,
        price: parseFloat(currentData.p),
        second: (new Date(currentData.E)).getSeconds(),
        minute: (new Date(currentData.E)).getMinutes()
    }
    currentTicker.push(symbolObj);
    const firstPriceObj = currentTicker[0];
    if(symbolObj.minute !== firstPriceObj.minute) {
        currentTicker = currentTicker.filter((i:any) => i.minute !== firstPriceObj.minute);
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
                type = 'short'
            } else if(newPercent < 100) {
                difference = 100 - newPercent;
                type = 'long';
            }
            if(difference > maxDifference) {
                maxDifference = difference
                console.log(maxDifference)
            }
            //console.log(difference)
            //console.log(difference)
            if(difference > percent && (positionType ? positionType === type : true)) {
                const answers = { crypto: ticker.replace('USDT', '') }
                if(openPositions.length < 1) {
                    if(type === 'short') {
                        bot.createOrderShort(answers, true)
                    } else {
                        bot.createOrderLong(answers, true)
                    }
                    openPositions.push(ticker);
                    symbolLastPrices[ticker] = [] //clear array after find
                    const date = new Date()
                    console.log(`${functionType}, ${ticker}: ${newPercent} = ${difference}, prev price: ${prevPrice}, current price: ${currentPrice}, date: ${date.getSeconds()}, ${date.getMilliseconds()}`);
                    fs.writeFile(`${ticker}.json`, JSON.stringify(currentTicker, null, 2), function(err: any) {
                        if(err) {
                            return console.log(err);
                        }
                        console.log("The file was saved!");
                    });
                }
            }
        }
        const currentValue = currentTicker[currentTicker.length - 1];
        const checkDiffCurrAndPrev = () => {
            const prevValue = currentTicker[currentTicker.length - 2]
            calculatePercent(prevValue.price, currentValue.price, 'checkDiffCurrAndPrev')
        }
        const checkDiffCurrAndPrevSecond = () => {
            const prevSecondPrice = [...currentTicker.filter((i:any) => currentValue.second - i.second === 1)].pop() //without current element;
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
