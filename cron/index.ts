import {BinanceBot, getBinanceConfig } from "../bot";

const cron = require('node-cron');
let bot: any;
let currentSymbol = 'LUNAUSDT';
getBinanceConfig().then(async data => {
    bot = new BinanceBot(data);
    console.log(Date.now());
    cron.schedule("08 18 30 5 *", async () => { // 0 * * * * = every houre at minute 0
        await placeOrder(currentSymbol, 10)
    });
})

const placeOrder = async (symbol: string, amountUSD: number) => {
    let price;
    do {
        try {
            const { askPrice } = await bot.binance.bookTickers(symbol);
            price = parseFloat(askPrice)
            const quantity = (amountUSD / askPrice).toFixed(2);
            console.log('quantity - ' + quantity)
            const response = await bot.binance.marketBuy(symbol, quantity);
            console.log(response)
        } catch (e: any) {
            const error = JSON.parse(e.body || 'null');
            console.log(symbol);
            console.log(error);
            if(error && error.msg.includes(`Invalid symbol`)) {
                currentSymbol = currentSymbol !== 'LUNAUSDT' ? 'LUNAUSDT' : 'LUNABUSD'
                placeOrder(currentSymbol, 15)
            }
        }
    } while (price === 0)
}
// cron.schedule("0 * * * *", () => { // 0 * * * * = every houre at minute 0
//     console.log("running a task every houre");
// });
// for test
