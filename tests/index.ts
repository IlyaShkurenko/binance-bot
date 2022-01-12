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
    { price: '4063.96', second: 42 },
    { price: '4063.76', second: 43 },
    { price: '4063.72', second: 43 },
    { price: '4064.73', second: 43 }
]


const testTradeAlgo = () => {
    const currentData = {
        s: 'ETHUSDT'
    };
    const currentTicker = arr4;
    const calculatePercent = (prevPrice: number, currentPrice: number, functionType: string) => {
        const percent = 0.1;
        const newPercent = (prevPrice / currentPrice) * 100;
        const ticker = currentData.s;
        let type: string = '', difference: number = 0;
        if(newPercent > 100) {
            difference = newPercent - 100;
            type = 'short'
        } else if(newPercent < 100) {
            difference = 100 - newPercent;
            type = 'long';
        }
        console.log(functionType + ' ' + currentPrice + ' ' + prevPrice + ' ' + difference)
        if(difference > percent) {
            const date = new Date()
            console.log(`${functionType}, ${ticker}: ${newPercent} = ${difference}, prev price: ${prevPrice}, current price: ${currentPrice}, date: ${date.getSeconds()}, ${date.getMilliseconds()}`);
        }
    }
    const currentValue = currentTicker[currentTicker.length - 1];
    const checkDiffCurrAndPrev = () => {
        const prevValue = currentTicker[currentTicker.length - 2]
        calculatePercent(parseFloat(prevValue.price), parseFloat(currentValue.price), 'checkDiffCurrAndPrev')
    }
    const checkDiffCurrAndPrevSecond = () => {
        const prevSecondPrice = [...currentTicker.filter((i:any) => currentValue.second - i.second === 1 )].pop() //without current element;
        if(prevSecondPrice) {
            calculatePercent(parseFloat(prevSecondPrice.price), parseFloat(currentValue.price), 'checkDiffCurrAndPrevSecond')
        }
    }
    const checkDiffCurrAndCurrMinSec = () => {
        const currentSecondPrices = [...currentTicker.filter((i:any) => i.second === currentValue.second)] //without current element;
        currentSecondPrices.pop();
        // @ts-ignore
        if(currentSecondPrices.length) {
            const minimalValue = currentSecondPrices.reduce(function(prev:any, curr:any) {
                return prev.price < curr.price ? prev : curr;
            });
            calculatePercent(parseFloat(minimalValue.price), parseFloat(currentValue.price), 'checkDiffCurrAndCurrMinSec')
        }
    };
    checkDiffCurrAndPrev();
    checkDiffCurrAndCurrMinSec();
    checkDiffCurrAndPrevSecond();
}


testTradeAlgo();
