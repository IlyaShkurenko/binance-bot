"use strict";
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
exports.syncPositions = exports.createOrderShort = exports.createOrderLong = void 0;
var fs = require('fs').promises;
var open = require('open');
var Binance = require('node-binance-api');
var binance = new Binance().options({
    APIKEY: process.env.API_KEY || 'NRk3HsINGsmsDXZe9eA2w6r8zJ3iGTT9eyntWd4BhIjbmLAv2ixH9zncrf3dBR66',
    APISECRET: process.env.SECRET_KEY || 'qGgU4Rd46e8dxHfCAEJSG99WdXCuiqB9wgHuaLj54iqGZqYGy3TvnZmjySMxxOfj'
});
var createOrderLong = function (answers) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, amount, crypto_1, symbol, _b, quantity, markPrice, pricePrecision, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = answers.amount, amount = _a === void 0 ? 1 : _a, crypto_1 = answers.crypto;
                symbol = "".concat(crypto_1.toUpperCase(), "USDT");
                return [4 /*yield*/, getQuantity(amount, symbol)];
            case 1:
                _b = _c.sent(), quantity = _b.quantity, markPrice = _b.markPrice, pricePrecision = _b.pricePrecision;
                return [4 /*yield*/, openLongPosition(symbol, markPrice, quantity, pricePrecision)];
            case 2:
                _c.sent();
                open("https://www.tradingview.com/chart/hMro8xGq/?symbol=BINANCE%3A".concat(symbol, "PERP"), { app: { name: 'google chrome' } });
                return [2 /*return*/];
            case 3:
                error_1 = _c.sent();
                console.log(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createOrderLong = createOrderLong;
var createOrderShort = function (answers) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, amount, crypto_2, symbol, _b, quantity, markPrice, pricePrecision, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = answers.amount, amount = _a === void 0 ? 95 : _a, crypto_2 = answers.crypto;
                symbol = "".concat(crypto_2.toUpperCase(), "USDT");
                return [4 /*yield*/, getQuantity(amount, symbol)];
            case 1:
                _b = _c.sent(), quantity = _b.quantity, markPrice = _b.markPrice, pricePrecision = _b.pricePrecision;
                return [4 /*yield*/, openShortPosition(symbol, markPrice, quantity, pricePrecision)];
            case 2:
                _c.sent();
                open("https://www.tradingview.com/chart/hMro8xGq/?symbol=BINANCE%3A".concat(symbol, "PERP"), { app: { name: 'google chrome' } });
                return [2 /*return*/];
            case 3:
                error_2 = _c.sent();
                console.log(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createOrderShort = createOrderShort;
var syncPositions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, exchangeInfo, risk_1, data, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Promise.all([
                        binance.futuresExchangeInfo(),
                        binance.futuresPositionRisk(),
                    ])];
            case 1:
                _a = _b.sent(), exchangeInfo = _a[0], risk_1 = _a[1];
                data = exchangeInfo.symbols.map(function (_a) {
                    var symbol = _a.symbol, quantityPrecision = _a.quantityPrecision, pricePrecision = _a.pricePrecision;
                    var _b = risk_1.find(function (i) { return i.symbol === symbol; }), maxNotionalValue = _b.maxNotionalValue, leverage = _b.leverage;
                    return {
                        symbol: symbol,
                        quantityPrecision: quantityPrecision,
                        pricePrecision: pricePrecision,
                        maxNotionalValue: parseInt(maxNotionalValue),
                        leverage: parseInt(leverage)
                    };
                });
                return [4 /*yield*/, fs.writeFile("symbols.json", JSON.stringify(data, null, 2), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("The file was saved!");
                    })];
            case 2:
                _b.sent();
                console.log(data.length);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.log(error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.syncPositions = syncPositions;
var openLongPosition = function (symbol, markPrice, quantity, pricePrecision) { return __awaiter(void 0, void 0, void 0, function () {
    var order, takeProfitPrice, take, stopLossPrice, stop;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.time('order');
                return [4 /*yield*/, binance.futuresMarketBuy(symbol, quantity)];
            case 1:
                order = _a.sent();
                console.timeEnd('order');
                if (order.msg)
                    throw new Error(order.msg);
                takeProfitPrice = (parseFloat(markPrice) + markPrice * 0.02).toFixed(pricePrecision);
                return [4 /*yield*/, binance.futuresSell(symbol, quantity, takeProfitPrice, { type: 'TAKE_PROFIT', stopPrice: takeProfitPrice })];
            case 2:
                take = _a.sent();
                if (take.msg)
                    throw new Error(take.msg);
                stopLossPrice = (parseFloat(markPrice) - markPrice * 0.002).toFixed(pricePrecision);
                return [4 /*yield*/, binance.futuresMarketSell(symbol, quantity, { type: 'STOP_MARKET', stopPrice: stopLossPrice })];
            case 3:
                stop = _a.sent();
                if (stop.msg)
                    throw new Error(stop.msg);
                return [2 /*return*/];
        }
    });
}); };
var openShortPosition = function (symbol, markPrice, quantity, pricePrecision) { return __awaiter(void 0, void 0, void 0, function () {
    var order, takeProfitPrice, take, stopLossPrice, stop;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.time('order');
                return [4 /*yield*/, binance.futuresMarketSell(symbol, quantity)];
            case 1:
                order = _a.sent();
                console.timeEnd('order');
                if (order.msg)
                    throw new Error(order.msg);
                takeProfitPrice = (parseFloat(markPrice) - markPrice * 0.02).toFixed(pricePrecision);
                return [4 /*yield*/, binance.futuresBuy(symbol, quantity, takeProfitPrice, { type: 'TAKE_PROFIT', stopPrice: takeProfitPrice })];
            case 2:
                take = _a.sent();
                if (take.msg)
                    throw new Error(take.msg);
                stopLossPrice = (parseFloat(markPrice) + markPrice * 0.002).toFixed(pricePrecision);
                console.log(stopLossPrice);
                return [4 /*yield*/, binance.futuresMarketBuy(symbol, quantity, { type: 'STOP_MARKET', stopPrice: stopLossPrice })];
            case 3:
                stop = _a.sent();
                if (stop.msg)
                    throw new Error(stop.msg);
                return [2 /*return*/];
        }
    });
}); };
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
var getQuantity = function (amount, symbol) { return __awaiter(void 0, void 0, void 0, function () {
    var symbolsData, neededSymbolData, leverage, quantityPrecision, pricePrecision, maxNotionalValue, markPrice, desiredNotional, quantity;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.time('quantity');
                console.time('file');
                return [4 /*yield*/, getSymbolsData()];
            case 1:
                symbolsData = _a.sent();
                console.timeEnd('file');
                neededSymbolData = symbolsData.find(function (i) { return i.symbol === symbol; });
                leverage = neededSymbolData.leverage, quantityPrecision = neededSymbolData.quantityPrecision, pricePrecision = neededSymbolData.pricePrecision, maxNotionalValue = neededSymbolData.maxNotionalValue;
                console.time('price');
                return [4 /*yield*/, binance.futuresMarkPrice(symbol)];
            case 2:
                markPrice = (_a.sent()).markPrice;
                console.timeEnd('price');
                if (leverage === 25) {
                    amount *= 2;
                }
                desiredNotional = amount * leverage;
                if (desiredNotional > maxNotionalValue) {
                    desiredNotional = maxNotionalValue;
                }
                quantity = ((desiredNotional) / markPrice).toFixed(quantityPrecision);
                console.timeEnd('quantity');
                return [2 /*return*/, { quantity: parseInt(quantity), markPrice: markPrice, pricePrecision: pricePrecision }];
        }
    });
}); };
// const [exchangeInfo, leverageResponse, { markPrice }] = await Promise.all([
//     binance.futuresExchangeInfo(),
//     binance.futuresLeverage(symbol, leverage),
//     binance.futuresMarkPrice(symbol),
//     // binance.futuresMarginType(symbol, 'ISOLATED' )
// ]);
// const { quantityPrecision, pricePrecision } = exchangeInfo.symbols.find((i: any) => i.symbol === symbol);
