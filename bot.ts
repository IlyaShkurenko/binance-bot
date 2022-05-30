// import { connectWebSocketFuturesPrices } from "./websocket";

const fs = require('fs').promises;
const open = require('open');

const Binance = require('node-binance-api');

export class BinanceBot {
    public binance: any;
    private readonly defaultAmount: number;
    private readonly maxAmount: number;
    private readonly tradingViewLink: string;
    private readonly maxLeverage: number;

    constructor(config: {
        apiKey: string,
        apiSecret: string,
        maxLeverage: string,
        tradingViewLink: string,
        defaultAmount: number,
        maxAmount: number }) {
        const { apiKey, apiSecret, defaultAmount, maxAmount, tradingViewLink, maxLeverage } = config;
        if(!apiKey || !apiSecret) {
            throw 'Provide binance credentials'
        }
        this.defaultAmount = defaultAmount ;
        this.maxAmount = maxAmount;
        this.tradingViewLink = tradingViewLink;
        this.maxLeverage = parseInt(maxLeverage);
        this.binance = new Binance().options({
            APIKEY: apiKey,
            APISECRET: apiSecret
        });
    }
    createOrderLong = async (answers: any, debugMode: boolean) => {
        try {
            let { crypto, price }: { crypto: string,  price: number | undefined } = answers;
            const symbol = `${crypto.toUpperCase()}USDT`;
            const { quantity, markPrice, pricePrecision } = await this.getQuantity(symbol, price, debugMode);
            await this.openLongPosition(symbol, markPrice, quantity, pricePrecision);
            open(`${this.tradingViewLink}?symbol=BINANCE%3A${symbol}PERP`, { app: { name: 'google chrome' } });
            return
        } catch (error) {
            console.log(error)
        }
    }

    openLongPosition = async (symbol: string, markPrice: any, quantity: number, pricePrecision: number) => {
        console.time('order')
        const order = await this.binance.futuresMarketBuy(symbol, quantity);
        console.timeEnd('order')
        console.log(symbol + ' ' + quantity + ' ' + markPrice)
        if(order.msg) throw new Error(order.msg)
        // console.time('limitsell');
        const takeProfitPrice = (parseFloat(markPrice) + markPrice * 0.012).toFixed(pricePrecision);
        const take = await this.binance.futuresSell(symbol, quantity, takeProfitPrice, { type: 'TAKE_PROFIT', stopPrice: takeProfitPrice });
        if(take.msg) throw new Error(take.msg)
        // const stopLossPrice = (parseFloat(markPrice) - markPrice * 0.002).toFixed(pricePrecision);
        // const stop = await this.binance.futuresMarketSell(symbol, quantity, { type: 'STOP_MARKET', stopPrice: stopLossPrice });
        // if(stop.msg) throw new Error(stop.msg)
    }

    createOrderShort = async (answers: any, debugMode: boolean) => {
        try {
            let { crypto, price }: { crypto: string,  price: number | undefined } = answers;
            const symbol = `${crypto.toUpperCase()}USDT`;
            const { quantity, markPrice, pricePrecision } = await this.getQuantity(symbol, price, debugMode);
            await this.openShortPosition(symbol, markPrice, quantity, pricePrecision);
            open(`${this.tradingViewLink}?symbol=BINANCE%3A${symbol}PERP`, { app: { name: 'google chrome' } });
            return
        } catch (error) {
            console.log(error)
        }
    }

    openShortPosition = async (symbol: string, markPrice: any, quantity: number, pricePrecision: number) => {
        console.time('order')
        const order = await this.binance.futuresMarketSell(symbol, quantity);
        console.timeEnd('order')
        console.log(symbol + ' ' + quantity + ' ' + markPrice)
        if(order.msg) throw new Error(order.msg)
        const takeProfitPrice = (parseFloat(markPrice) - markPrice * 0.012).toFixed(pricePrecision);
        const take = await this.binance.futuresBuy(symbol, quantity, takeProfitPrice, { type: 'TAKE_PROFIT', stopPrice: takeProfitPrice });
        if(take.msg) throw new Error(take.msg)
        // const stopLossPrice = (parseFloat(markPrice) + markPrice * 0.002).toFixed(pricePrecision);
        // console.log(stopLossPrice)
        // const stop = await this.binance.futuresMarketBuy(symbol, quantity, { type: 'STOP_MARKET', stopPrice: stopLossPrice });
        // if(stop.msg) throw new Error(stop.msg)
    }

    getQuantity = async (symbol: string, price?: number, debugMode?: boolean) => {
        console.time('quantity')
        console.time('file');
        let amount
        const symbolsData = await getExchangeInfo();
        console.timeEnd('file')
        const neededSymbolData = symbolsData.find((i:any) => i.symbol === symbol);
        const { leverage, quantityPrecision, pricePrecision, maxNotionalValue }:
            { leverage: number, quantityPrecision: number, pricePrecision: number, maxNotionalValue: number } = neededSymbolData;
        console.time('price')
        let markPrice;
        if(price) {
            markPrice = price
        } else {
            const priceData = await this.binance.futuresMarkPrice(symbol);
            markPrice = priceData.markPrice;
        }
        const maxAmount = maxNotionalValue / leverage; // 100
        if(debugMode) {
            amount = 1
        } else if(this.defaultAmount < 100) {
            amount = this.defaultAmount;
        } else if(maxAmount >= this.maxAmount) {
            amount = this.maxAmount
        } else if(this.defaultAmount > maxAmount) {
            amount = maxAmount
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
        const quantity = ((desiredNotional * 0.98) / markPrice).toFixed(quantityPrecision);
        console.timeEnd('quantity');
        return { quantity: parseFloat(quantity), markPrice, pricePrecision }
    }

    syncPositions = async () => {
        try {
            const symbols: any = {};
            const [exchangeInfo, risk] = await Promise.all([
                this.binance.futuresExchangeInfo(),
                this.binance.futuresPositionRisk(),
            ]);
            const data = exchangeInfo.symbols.map(( { symbol, quantityPrecision, pricePrecision }: { symbol: string, quantityPrecision: number, pricePrecision: number }) => {
                const { maxNotionalValue, leverage }: { leverage: string, maxNotionalValue: string } = risk.find((i:any) => i.symbol === symbol);
                if(symbol.includes('USDT')) {
                    symbols[symbol] = []
                }
                const symbolLeverage = parseInt(leverage);
                return {
                    symbol,
                    quantityPrecision,
                    pricePrecision,
                    maxNotionalValue: parseInt(maxNotionalValue),
                    leverage: symbolLeverage && this.maxLeverage && symbolLeverage > this.maxLeverage ? this.maxLeverage : parseInt(leverage)
                }
            })
            await fs.writeFile("exchange-symbols.json", JSON.stringify(data, null, 2), function(err: any) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
            await fs.writeFile("symbols.json", JSON.stringify(symbols, null, 2), function(err: any) {
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
        positionType: '',
        tradingViewLink: '',
        maxLeverage: '',
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

export const getExchangeInfo = async () => {
    const data = await fs.readFile("exchange-symbols.json", 'utf-8');
    return JSON.parse(data);
}
export const getSymbolsData = async () => {
    const data = await fs.readFile("symbols.json", 'utf-8');
    return JSON.parse(data);
}


// const [exchangeInfo, leverageResponse, { markPrice }] = await Promise.all([
//     binance.futuresExchangeInfo(),
//     binance.futuresLeverage(symbol, leverage),
//     binance.futuresMarkPrice(symbol),
//     // binance.futuresMarginType(symbol, 'ISOLATED' )
// ]);
// const { quantityPrecision, pricePrecision } = exchangeInfo.symbols.find((i: any) => i.symbol === symbol);
