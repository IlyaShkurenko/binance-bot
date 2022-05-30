import {BinanceBot, getBinanceConfig } from "../bot";

const cron = require('node-cron');
let bot: any;
let currentSymbol = 'LUNAUSDT';
let requestsCount = 0;
let tryCreateOrdersCount = 0;
getBinanceConfig().then(async data => {
    bot = new BinanceBot(data);
    console.log(Date.now());
    cron.schedule("55 05 * * *", async () => { // 0 * * * * = every houre at minute 0
        await placeOrder(currentSymbol)
    });
})

export const placeOrder = async (symbol: string, botInstance?: any) => {
    let price;
    const amountUSD = symbol === 'LUNAUSDT' ? 1500 : 600;
    if(!bot && botInstance) {
        bot = botInstance;
    }
    do {
        try {
            const { askPrice } = await bot.binance.bookTickers(symbol);
            requestsCount++;
            price = parseFloat(askPrice);
            const quantity = (amountUSD / askPrice).toFixed(2);
            console.log(`amount - ${amountUSD}, quantity - ${quantity}`);
            if(!isNaN(parseFloat(quantity)) && parseFloat(quantity) !== Infinity) {
                tryCreateOrdersCount++;
                const response = await bot.binance.marketBuy(symbol, quantity);
                requestsCount++;
                console.log(response)
            }
            console.log(requestsCount)
        } catch (e: any) {
            const error = JSON.parse(e.body || 'null');
            console.log(symbol);
            console.log(error);
            if(error && error.msg.includes(`Invalid symbol`)) {
                currentSymbol = currentSymbol !== 'LUNAUSDT' ? 'LUNAUSDT' : 'LUNABUSD'
                placeOrder(currentSymbol)
            }
        }
    } while (price === 0 && tryCreateOrdersCount < 10)
}
// cron.schedule("0 * * * *", () => { // 0 * * * * = every houre at minute 0
//     console.log("running a task every houre");
// });
// for test
