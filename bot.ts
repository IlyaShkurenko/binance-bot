const fs = require('fs').promises;
const open = require('open');

const Binance = require('node-binance-api');

export class BinanceBot {
    private readonly binance: any;
    private readonly defaultAmount: number;
    private readonly maxAmount: number;

    constructor(config: { apiKey: string, apiSecret: string, defaultAmount: number, maxAmount: number }) {
        const { apiKey, apiSecret, defaultAmount, maxAmount } = config;
        if(!apiKey || !apiSecret) {
            throw 'Provide binance credentials'
        }
        this.defaultAmount = defaultAmount ;
        this.maxAmount = maxAmount;
        this.binance = new Binance().options({
            APIKEY: apiKey,
            APISECRET: apiSecret
        });
    }
    createOrderLong = async (answers: any) => {
        try {
            let { crypto }: { crypto: string } = answers;
            const symbol = `${crypto.toUpperCase()}USDT`;
            const { quantity, markPrice, pricePrecision } = await this.getQuantity(symbol);
            await this.openLongPosition(symbol, markPrice, quantity, pricePrecision);
            open(`https://www.tradingview.com/chart/hMro8xGq/?symbol=BINANCE%3A${symbol}PERP`, { app: { name: 'google chrome' } });
            return
        } catch (error) {
            console.log(error)
        }
    }

    openLongPosition = async (symbol: string, markPrice: any, quantity: number, pricePrecision: number) => {
        console.time('order')
        const order = await this.binance.futuresMarketBuy(symbol, quantity);
        console.timeEnd('order')
        if(order.msg) throw new Error(order.msg)
        // console.time('limitsell');
        const takeProfitPrice = (parseFloat(markPrice) + markPrice * 0.02).toFixed(pricePrecision);
        const take = await this.binance.futuresSell(symbol, quantity, takeProfitPrice, { type: 'TAKE_PROFIT', stopPrice: takeProfitPrice });
        if(take.msg) throw new Error(take.msg)
        const stopLossPrice = (parseFloat(markPrice) - markPrice * 0.002).toFixed(pricePrecision);
        const stop = await this.binance.futuresMarketSell(symbol, quantity, { type: 'STOP_MARKET', stopPrice: stopLossPrice });
        if(stop.msg) throw new Error(stop.msg)
    }

    createOrderShort = async (answers: any) => {
        try {
            let { crypto }: { crypto: string } = answers;
            const symbol = `${crypto.toUpperCase()}USDT`;
            const { quantity, markPrice, pricePrecision } = await this.getQuantity(symbol);
            await this.openShortPosition(symbol, markPrice, quantity, pricePrecision);
            open(`https://www.tradingview.com/chart/hMro8xGq/?symbol=BINANCE%3A${symbol}PERP`, { app: { name: 'google chrome' } });
            return
        } catch (error) {
            console.log(error)
        }
    }

    openShortPosition = async (symbol: string, markPrice: any, quantity: number, pricePrecision: number) => {
        console.time('order')
        const order = await this.binance.futuresMarketSell(symbol, quantity);
        console.timeEnd('order')
        if(order.msg) throw new Error(order.msg)
        const takeProfitPrice = (parseFloat(markPrice) - markPrice * 0.02).toFixed(pricePrecision);
        const take = await this.binance.futuresBuy(symbol, quantity, takeProfitPrice, { type: 'TAKE_PROFIT', stopPrice: takeProfitPrice });
        if(take.msg) throw new Error(take.msg)
        const stopLossPrice = (parseFloat(markPrice) + markPrice * 0.002).toFixed(pricePrecision);
        console.log(stopLossPrice)
        const stop = await this.binance.futuresMarketBuy(symbol, quantity, { type: 'STOP_MARKET', stopPrice: stopLossPrice });
        if(stop.msg) throw new Error(stop.msg)
    }

    getQuantity = async (symbol: string) => {
        console.time('quantity')
        console.time('file');
        let amount = 100;
        const symbolsData = await this.getSymbolsData();
        console.timeEnd('file')
        const neededSymbolData = symbolsData.find((i:any) => i.symbol === symbol);
        const { leverage, quantityPrecision, pricePrecision, maxNotionalValue }:
            { leverage: number, quantityPrecision: number, pricePrecision: number, maxNotionalValue: number } = neededSymbolData;
        console.time('price')
        const { markPrice } = await this.binance.futuresMarkPrice(symbol);
        const maxAmount = maxNotionalValue / leverage;
        if(this.defaultAmount < 100) {
            amount = this.defaultAmount;
        } else if(maxAmount >= this.maxAmount) {
            amount = this.maxAmount
        } else if(this.maxAmount > maxAmount && this.defaultAmount < maxAmount) {
            amount = maxAmount
        } else {
            amount = this.defaultAmount;
        }
        console.timeEnd('price')
        let desiredNotional = amount * leverage;
        if(desiredNotional > maxNotionalValue) {
            desiredNotional = maxNotionalValue;
        }
        const quantity = ((desiredNotional - desiredNotional * 0.02) / markPrice).toFixed(quantityPrecision);
        console.timeEnd('quantity');
        return { quantity: parseInt(quantity), markPrice, pricePrecision }
    }

    syncPositions = async () => {
        try {
            const [exchangeInfo, risk] = await Promise.all([
                this.binance.futuresExchangeInfo(),
                this.binance.futuresPositionRisk(),
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

    getSymbolsData = async () => {
        const data = await fs.readFile("symbols.json", 'utf-8');
        return JSON.parse(data);
    }
}

export const saveBinanceConfig = async (answers: any) => {
    const currentConfig = await getBinanceConfig() as any;
    const config: any = {};
    Object.keys(answers).forEach((i: string) => {
        const value = answers[i] || currentConfig[i];
        if(value) {
            config[i] = value
        }
    });
    console.log(config)
    await fs.writeFile("keys.json", JSON.stringify( config, null, 2), function(err: any) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

export const getBinanceConfig = async () => {
    let data = {
        apiKey: '',
        apiSecret: '',
        defaultAmount: 100,
        maxAmount: 100
    };
    try {
        const stringData = await fs.readFile("keys.json", 'utf-8');
        data = JSON.parse(stringData);
    } catch (e) {
        console.log(e)
    }
    return data;
}


// const [exchangeInfo, leverageResponse, { markPrice }] = await Promise.all([
//     binance.futuresExchangeInfo(),
//     binance.futuresLeverage(symbol, leverage),
//     binance.futuresMarkPrice(symbol),
//     // binance.futuresMarginType(symbol, 'ISOLATED' )
// ]);
// const { quantityPrecision, pricePrecision } = exchangeInfo.symbols.find((i: any) => i.symbol === symbol);
