const arr1 = [
    { price: '4063.84', second: 42 },
    { price: '4063.96', second: 42 },
    { price: '4063.97', second: 42 },
    { price: '4063.83', second: 42 },
    { price: '4063.97', second: 42 },
    { price: '4063.96', second: 42 },
    { price: '4063.76', second: 43 },
    { price: '4063.72', second: 43 },
    { price: '4063.73', second: 43 }
]
const arr2 = [
    { price: '4063.84', second: 42 },
    { price: '4063.96', second: 42 },
    { price: '4063.97', second: 42 },
    { price: '4063.83', second: 42 },
    { price: '4063.97', second: 42 },
    { price: '4063.96', second: 42 },
    { price: '4063.76', second: 43 },
    { price: '4063.72', second: 43 }
]

const arr3 = [
    { price: '4063.84', second: 42 },
    { price: '4063.96', second: 42 },
    { price: '4063.97', second: 42 },
    { price: '4063.83', second: 42 },
    { price: '4063.97', second: 42 },
    { price: '4063.96', second: 42 },
    { price: '4063.76', second: 43 }
]

const arr4 = [
    { price: '4063.73', second: 41 },
    { price: '4063.92', second: 41 },
    { price: '4063.93', second: 41 },
    { price: '4063.72', second: 41 },
    { price: '4063.94', second: 41 },
    { price: '4063.84', second: 41 },
    { price: '4063.85', second: 41 },
    { price: '4063.95', second: 41 },
    { price: '4064.06', second: 41 },
    { price: '4063.95', second: 41 },
    { price: '4063.94', second: 41 },
    { price: '4063.83', second: 41 },
    { price: '4063.76', second: 41 },
    { price: '4063.84', second: 42 },
    { price: '4063.96', second: 42 },
    { price: '4063.97', second: 42 },
    { price: '4063.83', second: 42 },
    { price: '4063.97', second: 42 },
    { price: '4063.96', second: 42 }
]


const testTradeAlgo = () => {
    const currentData = {
        s: 'ETHUSDT'
    };
    const currentTicker = arr4;
    const calculatePercent = (prevPrice: number, currentPrice: number) => {
        console.log(currentPrice + ' ' + prevPrice)
        const percent = 0.03;
        const newPercent = (prevPrice / currentPrice) * 100;
        const ticker = currentData.s;
        let type: string = '', difference: number = 0;
        if(newPercent > 100) {
            difference = newPercent - 100;
            type = 'long'
        } else if(newPercent < 100) {
            difference = 100 - newPercent;
            type = 'short';
        }
        //console.log(difference)
        if(difference > percent) {
            const date = new Date()
            console.log(`${ticker}: ${difference}, prev price: ${prevPrice}, current price: ${currentPrice}, date: ${date.getSeconds()}, ${date.getMilliseconds()}`)
        }
    }
    const currentValue = currentTicker[currentTicker.length - 1];
    const checkDiffCurrAndPrev = () => {
        const prevValue = currentTicker[currentTicker.length - 2]
        calculatePercent(parseFloat(prevValue.price), parseFloat(currentValue.price))
    }
    const checkDiffCurrAndCurrMinSec = () => {
        const currentSecondPrices = [...currentTicker.filter((i:any) => i.second === currentValue.second)] //without current element;
        currentSecondPrices.pop();
        // @ts-ignore
        if(currentSecondPrices.length) {
            const minimalValue = currentSecondPrices.reduce(function(prev:any, curr:any) {
                return prev.price < curr.price ? prev : curr;
            });
            calculatePercent(parseFloat(minimalValue.price), parseFloat(currentValue.price))
        }
    }
    const checkDiffCurrAndPrevSecond = () => {
        const prevSecondPrices = [...currentTicker.filter((i:any) => i.second !== currentValue.second)].pop() //without current element;
        // @ts-ignore
        calculatePercent(parseFloat(prevSecondPrices.price), parseFloat(currentValue.price))
    }
    checkDiffCurrAndCurrMinSec()
}


testTradeAlgo();
