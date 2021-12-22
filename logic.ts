import chalk from 'chalk'
import * as ora from 'ora'
const fs = require('fs').promises;
const open = require('open');

const Binance = require('node-binance-api');
const binance = new Binance().options({
    APIKEY: process.env.API_KEY || 'NRk3HsINGsmsDXZe9eA2w6r8zJ3iGTT9eyntWd4BhIjbmLAv2ixH9zncrf3dBR66',
    APISECRET: process.env.SECRET_KEY || 'qGgU4Rd46e8dxHfCAEJSG99WdXCuiqB9wgHuaLj54iqGZqYGy3TvnZmjySMxxOfj'
});

export const createOrderLong = async (answers: any) => {
    try {
        let { amount = 1, crypto }: { amount: number, crypto: string } = answers;
        const symbol = `${crypto.toUpperCase()}USDT`;
        const { quantity, markPrice, pricePrecision } = await getQuantity(amount, symbol);
        await openLongPosition(symbol, markPrice, quantity, pricePrecision);
        open(`https://www.tradingview.com/chart/hMro8xGq/?symbol=BINANCE%3A${symbol}PERP`, { app: { name: 'google chrome' } });
        return
    } catch (error) {
        console.log(error)
    }
}

export const createOrderShort = async (answers: any) => {
    try {
        let { amount = 95, crypto }: { amount: number, crypto: string } = answers;
        const symbol = `${crypto.toUpperCase()}USDT`;
        const { quantity, markPrice, pricePrecision } = await getQuantity(amount, symbol);
        await openShortPosition(symbol, markPrice, quantity, pricePrecision);
        open(`https://www.tradingview.com/chart/hMro8xGq/?symbol=BINANCE%3A${symbol}PERP`, { app: { name: 'google chrome' } });
        return
    } catch (error) {
        console.log(error)
    }
}

export const syncPositions = async () => {
    try {
        const [exchangeInfo, risk] = await Promise.all([
            binance.futuresExchangeInfo(),
            binance.futuresPositionRisk(),
        ]);
        const data = exchangeInfo.symbols.map(( { symbol, quantityPrecision, pricePrecision }: { symbol: string, quantityPrecision: number, pricePrecision: number }) => {
           const { maxNotionalValue, leverage }: { leverage: string, maxNotionalValue: string } = risk.find((i:any) => i.symbol === symbol)
           return {
               symbol,
               quantityPrecision,
               pricePrecision,
               maxNotionalValue: parseInt(maxNotionalValue),
               leverage: parseInt(leverage)
           }
        })
        await fs.writeFile("symbols.json", JSON.stringify(data, null, 2), function(err: any) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        console.log(data.length)
    } catch (error) {
        console.log(error)
    }
}

const openLongPosition = async (symbol: string, markPrice: any, quantity: number, pricePrecision: number) => {
    console.time('order')
    const order = await binance.futuresMarketBuy(symbol, quantity);
    console.timeEnd('order')
    if(order.msg) throw new Error(order.msg)
    // console.time('limitsell');
    const takeProfitPrice = (parseFloat(markPrice) + markPrice * 0.02).toFixed(pricePrecision);
    const take = await binance.futuresSell(symbol, quantity, takeProfitPrice, { type: 'TAKE_PROFIT', stopPrice: takeProfitPrice });
    if(take.msg) throw new Error(take.msg)
    const stopLossPrice = (parseFloat(markPrice) - markPrice * 0.002).toFixed(pricePrecision);
    const stop = await binance.futuresMarketSell(symbol, quantity, { type: 'STOP_MARKET', stopPrice: stopLossPrice });
    if(stop.msg) throw new Error(stop.msg)
}

const openShortPosition = async (symbol: string, markPrice: any, quantity: number, pricePrecision: number) => {
    console.time('order')
    const order = await binance.futuresMarketSell(symbol, quantity);
    console.timeEnd('order')
    if(order.msg) throw new Error(order.msg)
    const takeProfitPrice = (parseFloat(markPrice) - markPrice * 0.02).toFixed(pricePrecision);
    const take = await binance.futuresBuy(symbol, quantity, takeProfitPrice, { type: 'TAKE_PROFIT', stopPrice: takeProfitPrice });
    if(take.msg) throw new Error(take.msg)
    const stopLossPrice = (parseFloat(markPrice) + markPrice * 0.002).toFixed(pricePrecision);
    console.log(stopLossPrice)
    const stop = await binance.futuresMarketBuy(symbol, quantity, { type: 'STOP_MARKET', stopPrice: stopLossPrice });
    if(stop.msg) throw new Error(stop.msg)
}

const getSymbolsData = async () => {
    const data = await fs.readFile("symbols.json", 'utf-8');
    return JSON.parse(data);
}

const getQuantity = async (amount: number, symbol: string) => {
    console.time('quantity')
    console.time('file')
    const symbolsData = await getSymbolsData();
    console.timeEnd('file')
    const neededSymbolData = symbolsData.find((i:any) => i.symbol === symbol);
    const { leverage, quantityPrecision, pricePrecision, maxNotionalValue }:
        { leverage: number, quantityPrecision: number, pricePrecision: number, maxNotionalValue: number } = neededSymbolData;
    console.time('price')
    const { markPrice } = await binance.futuresMarkPrice(symbol);
    console.timeEnd('price')
    if(leverage === 25) {
        amount*=2;
    }
    let desiredNotional = amount * leverage;
    if(desiredNotional > maxNotionalValue) {
        desiredNotional = maxNotionalValue;
    }
    const quantity = ((desiredNotional) / markPrice).toFixed(quantityPrecision);
    console.timeEnd('quantity');
    return { quantity: parseInt(quantity), markPrice, pricePrecision }
}


// const [exchangeInfo, leverageResponse, { markPrice }] = await Promise.all([
//     binance.futuresExchangeInfo(),
//     binance.futuresLeverage(symbol, leverage),
//     binance.futuresMarkPrice(symbol),
//     // binance.futuresMarginType(symbol, 'ISOLATED' )
// ]);
// const { quantityPrecision, pricePrecision } = exchangeInfo.symbols.find((i: any) => i.symbol === symbol);
