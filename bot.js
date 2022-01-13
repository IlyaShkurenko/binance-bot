"use strict";
// import { connectWebSocketFuturesPrices } from "./websocket";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSymbolsData = exports.getExchangeInfo = exports.getBinanceConfig = exports.saveBinanceConfig = exports.BinanceBot = void 0;
var fs = require('fs').promises;
var open = require('open');
var Binance = require('node-binance-api');
var BinanceBot = /** @class */ (function () {
    function BinanceBot(config) {
        var _this = this;
        this.createOrderLong = function (answers, debugMode) { return __awaiter(_this, void 0, void 0, function () {
            var crypto_1, price, symbol, _a, quantity, markPrice, pricePrecision, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        crypto_1 = answers.crypto, price = answers.price;
                        symbol = "".concat(crypto_1.toUpperCase(), "USDT");
                        return [4 /*yield*/, this.getQuantity(symbol, price, debugMode)];
                    case 1:
                        _a = _b.sent(), quantity = _a.quantity, markPrice = _a.markPrice, pricePrecision = _a.pricePrecision;
                        return [4 /*yield*/, this.openLongPosition(symbol, markPrice, quantity, pricePrecision)];
                    case 2:
                        _b.sent();
                        open("".concat(this.tradingViewLink, "?symbol=BINANCE%3A").concat(symbol, "PERP"), { app: { name: 'google chrome' } });
                        return [2 /*return*/];
                    case 3:
                        error_1 = _b.sent();
                        console.log(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.openLongPosition = function (symbol, markPrice, quantity, pricePrecision) { return __awaiter(_this, void 0, void 0, function () {
            var order, takeProfitPrice, take;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.time('order');
                        return [4 /*yield*/, this.binance.futuresMarketBuy(symbol, quantity)];
                    case 1:
                        order = _a.sent();
                        console.timeEnd('order');
                        console.log(symbol + ' ' + quantity + ' ' + markPrice);
                        if (order.msg)
                            throw new Error(order.msg);
                        takeProfitPrice = (parseFloat(markPrice) + markPrice * 0.012).toFixed(pricePrecision);
                        return [4 /*yield*/, this.binance.futuresSell(symbol, quantity, takeProfitPrice, { type: 'TAKE_PROFIT', stopPrice: takeProfitPrice })];
                    case 2:
                        take = _a.sent();
                        if (take.msg)
                            throw new Error(take.msg);
                        return [2 /*return*/];
                }
            });
        }); };
        this.createOrderShort = function (answers, debugMode) { return __awaiter(_this, void 0, void 0, function () {
            var crypto_2, price, symbol, _a, quantity, markPrice, pricePrecision, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        crypto_2 = answers.crypto, price = answers.price;
                        symbol = "".concat(crypto_2.toUpperCase(), "USDT");
                        return [4 /*yield*/, this.getQuantity(symbol, price, debugMode)];
                    case 1:
                        _a = _b.sent(), quantity = _a.quantity, markPrice = _a.markPrice, pricePrecision = _a.pricePrecision;
                        return [4 /*yield*/, this.openShortPosition(symbol, markPrice, quantity, pricePrecision)];
                    case 2:
                        _b.sent();
                        open("".concat(this.tradingViewLink, "?symbol=BINANCE%3A").concat(symbol, "PERP"), { app: { name: 'google chrome' } });
                        return [2 /*return*/];
                    case 3:
                        error_2 = _b.sent();
                        console.log(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.openShortPosition = function (symbol, markPrice, quantity, pricePrecision) { return __awaiter(_this, void 0, void 0, function () {
            var order, takeProfitPrice, take;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.time('order');
                        return [4 /*yield*/, this.binance.futuresMarketSell(symbol, quantity)];
                    case 1:
                        order = _a.sent();
                        console.timeEnd('order');
                        console.log(symbol + ' ' + quantity + ' ' + markPrice);
                        if (order.msg)
                            throw new Error(order.msg);
                        takeProfitPrice = (parseFloat(markPrice) - markPrice * 0.012).toFixed(pricePrecision);
                        return [4 /*yield*/, this.binance.futuresBuy(symbol, quantity, takeProfitPrice, { type: 'TAKE_PROFIT', stopPrice: takeProfitPrice })];
                    case 2:
                        take = _a.sent();
                        if (take.msg)
                            throw new Error(take.msg);
                        return [2 /*return*/];
                }
            });
        }); };
        this.getQuantity = function (symbol, price, debugMode) { return __awaiter(_this, void 0, void 0, function () {
            var amount, symbolsData, neededSymbolData, leverage, quantityPrecision, pricePrecision, maxNotionalValue, markPrice, priceData, maxAmount, desiredNotional, quantity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.time('quantity');
                        console.time('file');
                        return [4 /*yield*/, (0, exports.getExchangeInfo)()];
                    case 1:
                        symbolsData = _a.sent();
                        console.timeEnd('file');
                        neededSymbolData = symbolsData.find(function (i) { return i.symbol === symbol; });
                        leverage = neededSymbolData.leverage, quantityPrecision = neededSymbolData.quantityPrecision, pricePrecision = neededSymbolData.pricePrecision, maxNotionalValue = neededSymbolData.maxNotionalValue;
                        console.time('price');
                        if (!price) return [3 /*break*/, 2];
                        markPrice = price;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.binance.futuresMarkPrice(symbol)];
                    case 3:
                        priceData = _a.sent();
                        markPrice = priceData.markPrice;
                        _a.label = 4;
                    case 4:
                        maxAmount = maxNotionalValue / leverage;
                        if (debugMode) {
                            amount = 1;
                        }
                        else if (this.defaultAmount < 100) {
                            amount = this.defaultAmount;
                        }
                        else if (maxAmount >= this.maxAmount) {
                            amount = this.maxAmount;
                        }
                        else if (this.defaultAmount > maxAmount) {
                            amount = maxAmount;
                        }
                        else if (this.maxAmount > maxAmount && this.defaultAmount < maxAmount) {
                            amount = maxAmount;
                        }
                        else {
                            amount = this.defaultAmount;
                        }
                        console.timeEnd('price');
                        desiredNotional = amount * leverage;
                        if (desiredNotional > maxNotionalValue) {
                            desiredNotional = maxNotionalValue;
                        }
                        quantity = ((desiredNotional * 0.98) / markPrice).toFixed(quantityPrecision);
                        console.timeEnd('quantity');
                        return [2 /*return*/, { quantity: parseFloat(quantity), markPrice: markPrice, pricePrecision: pricePrecision }];
                }
            });
        }); };
        this.syncPositions = function () { return __awaiter(_this, void 0, void 0, function () {
            var symbols_1, _a, exchangeInfo, risk_1, data, error_3;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        symbols_1 = {};
                        return [4 /*yield*/, Promise.all([
                                this.binance.futuresExchangeInfo(),
                                this.binance.futuresPositionRisk(),
                            ])];
                    case 1:
                        _a = _b.sent(), exchangeInfo = _a[0], risk_1 = _a[1];
                        data = exchangeInfo.symbols.map(function (_a) {
                            var symbol = _a.symbol, quantityPrecision = _a.quantityPrecision, pricePrecision = _a.pricePrecision;
                            var _b = risk_1.find(function (i) { return i.symbol === symbol; }), maxNotionalValue = _b.maxNotionalValue, leverage = _b.leverage;
                            if (symbol.includes('USDT')) {
                                symbols_1[symbol] = [];
                            }
                            var symbolLeverage = parseInt(leverage);
                            return {
                                symbol: symbol,
                                quantityPrecision: quantityPrecision,
                                pricePrecision: pricePrecision,
                                maxNotionalValue: parseInt(maxNotionalValue),
                                leverage: symbolLeverage && _this.maxLeverage && symbolLeverage > _this.maxLeverage ? _this.maxLeverage : parseInt(leverage)
                            };
                        });
                        return [4 /*yield*/, fs.writeFile("exchange-symbols.json", JSON.stringify(data, null, 2), function (err) {
                                if (err) {
                                    return console.log(err);
                                }
                                console.log("The file was saved!");
                            })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, fs.writeFile("symbols.json", JSON.stringify(symbols_1, null, 2), function (err) {
                                if (err) {
                                    return console.log(err);
                                }
                                console.log("The file was saved!");
                            })];
                    case 3:
                        _b.sent();
                        console.log(data.length);
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _b.sent();
                        console.log(error_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        var apiKey = config.apiKey, apiSecret = config.apiSecret, defaultAmount = config.defaultAmount, maxAmount = config.maxAmount, tradingViewLink = config.tradingViewLink, maxLeverage = config.maxLeverage;
        if (!apiKey || !apiSecret) {
            throw 'Provide binance credentials';
        }
        this.defaultAmount = defaultAmount;
        this.maxAmount = maxAmount;
        this.tradingViewLink = tradingViewLink;
        this.maxLeverage = parseInt(maxLeverage);
        this.binance = new Binance().options({
            APIKEY: apiKey,
            APISECRET: apiSecret
        });
    }
    return BinanceBot;
}());
exports.BinanceBot = BinanceBot;
var saveBinanceConfig = function (answers) { return __awaiter(void 0, void 0, void 0, function () {
    var currentConfig, config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getBinanceConfig)()];
            case 1:
                currentConfig = _a.sent();
                config = {};
                Object.keys(answers).forEach(function (i) {
                    var value = answers[i] || currentConfig[i];
                    if (value) {
                        config[i] = value;
                    }
                });
                console.log(config);
                return [4 /*yield*/, fs.writeFile("keys.json", JSON.stringify(config, null, 2), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("The file was saved!");
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.saveBinanceConfig = saveBinanceConfig;
var getBinanceConfig = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, stringData, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {
                    apiKey: '',
                    apiSecret: '',
                    positionType: '',
                    tradingViewLink: '',
                    maxLeverage: '',
                    defaultAmount: 100,
                    maxAmount: 100
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fs.readFile("keys.json", 'utf-8')];
            case 2:
                stringData = _a.sent();
                data = JSON.parse(stringData);
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.getBinanceConfig = getBinanceConfig;
var getExchangeInfo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.readFile("exchange-symbols.json", 'utf-8')];
            case 1:
                data = _a.sent();
                return [2 /*return*/, JSON.parse(data)];
        }
    });
}); };
exports.getExchangeInfo = getExchangeInfo;
var getSymbolsData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.readFile("symbols.json", 'utf-8')];
            case 1:
                data = _a.sent();
                return [2 /*return*/, JSON.parse(data)];
        }
    });
}); };
exports.getSymbolsData = getSymbolsData;
// const [exchangeInfo, leverageResponse, { markPrice }] = await Promise.all([
//     binance.futuresExchangeInfo(),
//     binance.futuresLeverage(symbol, leverage),
//     binance.futuresMarkPrice(symbol),
//     // binance.futuresMarginType(symbol, 'ISOLATED' )
// ]);
// const { quantityPrecision, pricePrecision } = exchangeInfo.symbols.find((i: any) => i.symbol === symbol);
