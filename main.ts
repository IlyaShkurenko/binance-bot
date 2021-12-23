#!/usr/bin/env node
import './polyfills'
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });
import * as commander from 'commander'
import * as inquirer from 'inquirer'
import chalk from 'chalk'
import { BinanceBot, saveBinanceConfig, getBinanceConfig } from './bot';
import { questions, keysQuestions } from './questions'

commander
    .version('1.0.0')
    .description('Contact Management System')

commander
    .command('config')
    .description('Set binance keys')
    .action(async () => {
        console.log(chalk.yellow('=========*** Binance System ***=========='))
        const answers = await inquirer.prompt(keysQuestions);
        await saveBinanceConfig(answers);
    })

commander
    .command('long')
    .description('Add an order')
    .action(async () => {
        console.log(chalk.yellow('=========*** Binance System ***=========='))
        while (true) {
            const answers = await inquirer.prompt(questions);
            console.log(new Date());
            console.time('createOrderLong');
            const config = await getBinanceConfig();
            const bot = new BinanceBot(config);
            await bot.createOrderLong(answers)
            console.timeEnd('createOrderLong');
        }
    })

commander
    .command('short')
    .description('Add an order')
    .action(async () => {
        console.log(chalk.yellow('=========*** Binance System ***=========='))
        while (true) {
            const answers = await inquirer.prompt(questions);
            console.log(new Date());
            console.time('createOrderShort');
            const config = await getBinanceConfig();
            const bot = new BinanceBot(config);
            await bot.createOrderShort(answers)
            console.timeEnd('createOrderShort');
        }
    })

commander
    .command('sync')
    .description('Sync leverage with max notional')
    .action(async () => {
        console.log(chalk.yellow('=========*** Binance System ***=========='))
        const config = await getBinanceConfig();
        const bot = new BinanceBot(config);
        await bot.syncPositions();
        process.exit()
    })

commander
    .command('stream')
    .description('Stream all futures')
    .action(async () => {
        console.log(chalk.yellow('=========*** Binance System ***=========='))
        const config = await getBinanceConfig();
        const bot = new BinanceBot(config);
        await bot.priceStream();
        process.exit()
    })

if (!process.argv.slice(2).length/* || !/[arudl]/.test(process.argv.slice(2))*/) {
    commander.outputHelp()
    process.exit()
}
commander.parse(process.argv)
