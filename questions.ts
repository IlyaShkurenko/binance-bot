export const questions: Array<Object> = [
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
]

export const keysQuestions: Array<Object> = [
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
    },
    {
        type: 'input',
        name: 'positionType',
        message: 'Enter position type'
    },
    {
        type: 'input',
        name: 'tradingViewLink',
        message: 'Enter trading view link'
    }
]
