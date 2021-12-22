#!/usr/bin/env node
import './polyfills'
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });
import * as commander from 'commander'
import * as inquirer from 'inquirer'
import chalk from 'chalk'
import { createOrderLong, createOrderShort, syncPositions } from './logic';
import { questions } from './questions'

commander
    .version('1.0.0')
    .description('Contact Management System')

commander
    .command('createFuturesOrderLong')
    .description('Add an order')
    .action(async () => {
        console.log(chalk.yellow('=========*** Binance System ***=========='))
        while (true) {
            const answers = await inquirer.prompt(questions);
            console.log(new Date());
            console.time('createOrderLong');
            await createOrderLong(answers)
            console.timeEnd('createOrderLong');
        }
    })

commander
    .command('createFuturesOrderShort')
    .description('Add an order')
    .action(async () => {
        console.log(chalk.yellow('=========*** Binance System ***=========='))
        while (true) {
            const answers = await inquirer.prompt(questions);
            console.log(new Date());
            console.time('createOrderShort');
            await createOrderShort(answers)
            console.timeEnd('createOrderShort');
        }
    })

commander
    .command('sync')
    .description('Sync leverage with max notional')
    .action(async () => {
        console.log(chalk.yellow('=========*** Binance System ***=========='))
        await syncPositions();
        process.exit()
    })

if (!process.argv.slice(2).length/* || !/[arudl]/.test(process.argv.slice(2))*/) {
    commander.outputHelp()
    process.exit()
}
commander.parse(process.argv)
