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
exports.placeOrder = void 0;
var bot_1 = require("../bot");
var cron = require('node-cron');
var bot;
var currentSymbol = 'LUNAUSDT';
(0, bot_1.getBinanceConfig)().then(function (data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        bot = new bot_1.BinanceBot(data);
        console.log(Date.now());
        cron.schedule("* 06 * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: // 0 * * * * = every houre at minute 0
                    return [4 /*yield*/, (0, exports.placeOrder)(currentSymbol)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
var placeOrder = function (symbol, botInstance) { return __awaiter(void 0, void 0, void 0, function () {
    var price, amountUSD, askPrice, quantity, response, e_1, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                amountUSD = symbol === 'LUNAUSDT' ? 1500 : 600;
                if (!bot && botInstance) {
                    bot = botInstance;
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, bot.binance.bookTickers(symbol)];
            case 2:
                askPrice = (_a.sent()).askPrice;
                price = parseFloat(askPrice);
                quantity = (amountUSD / askPrice).toFixed(2);
                console.log("amount - ".concat(amountUSD, ", quantity - ").concat(quantity));
                if (!(!isNaN(parseFloat(quantity)) && parseFloat(quantity) !== Infinity)) return [3 /*break*/, 4];
                return [4 /*yield*/, bot.binance.marketBuy(symbol, quantity)];
            case 3:
                response = _a.sent();
                console.log(response);
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                error = JSON.parse(e_1.body || 'null');
                console.log(symbol);
                console.log(error);
                if (error && error.msg.includes("Invalid symbol")) {
                    currentSymbol = currentSymbol !== 'LUNAUSDT' ? 'LUNAUSDT' : 'LUNABUSD';
                    (0, exports.placeOrder)(currentSymbol);
                }
                return [3 /*break*/, 6];
            case 6:
                if (price === 0) return [3 /*break*/, 1];
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.placeOrder = placeOrder;
// cron.schedule("0 * * * *", () => { // 0 * * * * = every houre at minute 0
//     console.log("running a task every houre");
// });
// for test
