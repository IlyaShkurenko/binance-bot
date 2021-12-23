"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keysQuestions = exports.questions = void 0;
exports.questions = [
    // {
    //     type: 'number',
    //     name: 'amount',
    //     message: 'Enter $'
    // },
    // {
    //     type: 'number',
    //     name: 'leverage',
    //     message: 'Enter Leverage'
    // },
    {
        type: 'input',
        name: 'crypto',
        message: 'Enter Crypto'
    }
];
exports.keysQuestions = [
    {
        type: 'input',
        name: 'apiKey',
        message: 'Enter API KEY'
    },
    {
        type: 'input',
        name: 'apiSecret',
        message: 'Enter SECRET KEY'
    },
    {
        type: 'number',
        name: 'defaultAmount',
        message: 'Enter default amount'
    },
    {
        type: 'number',
        name: 'maxAmount',
        message: 'Enter max amount'
    }
];
