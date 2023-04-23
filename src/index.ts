#!/usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
import { Invidious } from './helpers/invidious.js';
import { createSpinner } from 'nanospinner';
import { FormatStream, VideoSearch } from './models/invidious.models.js';


async function askForInput(message: string): Promise<string> {
    const q: any = await inquirer.prompt({
        name: 'query',
        type: 'input',
        message: message 
    });
    return q['query'];
}

async function askToSelectItem<T>(message: string, array: Array<any>, field: string | undefined = undefined): Promise<T> {
    const q: any = await inquirer.prompt({
        name: 'query',
        type: 'list',
        message: message,
        choices: array.map((item, index) => index + '-' + (field!==undefined ? item[field!] : item))
    });
    const selectedIndex: number = parseInt(q['query'].split('-')[0]);
    return array[selectedIndex];
}

async function tui() {
    const query: any = await askForInput('Youtube Search: ');

    let spinner = createSpinner('Looking thru the youtube API ... ').start();
    let result = await Invidious.searchVideo(query);
    spinner.success();

    const selItem = await askToSelectItem<VideoSearch>('Select youtube video: ', result, 'title');

    spinner = createSpinner('Looking thru the youtube API ... ').start();
    const qualities = await Invidious.getVideoQualities(selItem);
    spinner.success();


    const isMp3: boolean = await askToSelectItem('Please select a type: ', ['Mp3', 'Mp4']) === 'Mp3';
    let selectedQuality: FormatStream = qualities.formatStreams[0];
    if(!isMp3) {
        selectedQuality = await askToSelectItem<FormatStream>('Select quality: ', qualities.formatStreams, 'resolution'); 
    }

    await Invidious.downloadVideo(selectedQuality, selItem.title, isMp3);
}


async function getVideo(id: string, path: string, type: string | null, resolution: string | null) {
    let spinner = createSpinner('Looking thru the youtube API ... ').start();
    const qualities = await Invidious.getVideoQualitiesById(id);
    
    spinner.success();

    if(qualities.error) {
        console.error(chalk.bgRed(qualities.error));
        return;
    }

    const userConfirmed: boolean = await askToSelectItem(`Video found: ${qualities.title}\n Are you sure you want to procceed ?`, ['Yes', 'No']) === 'Yes';

    if(!userConfirmed) {
        console.error(chalk.bgRed('Please check the video id'));
        return;
    }
    
    const isMp3: boolean = (type && type === 'mp3') || await askToSelectItem('Please select a type: ', ['Mp3', 'Mp4']) === 'Mp3';
    let selectedQuality: FormatStream = qualities.formatStreams[0];
    if(!isMp3) {
        selectedQuality = await askToSelectItem<FormatStream>('Select quality: ', qualities.formatStreams, 'resolution'); 
    }

    await Invidious.downloadVideo(selectedQuality, path + qualities.title, isMp3);
 
}

function help() {
    
}

function main() {
    const argv = process.argv;
    let i = 2;

    let id: string | null = null;
    let type: string | null = null;
    let resolution: string = "720";
    let path: string = "./";

    while(i < argv.length){
        const arg: string = argv[i];
       
        switch(arg) {
            case '--tui':
                tui();
                return;
            case '--id':
                id = argv[++i];
                break;
            case '--type':
            case '-t':
                type = argv[++i];
                break;
            case '--resolution':
            case '-r':
                resolution = argv[++i];
                break;
            case '--path':
            case '-p':
                path = argv[++i];
                break;
            case '--help':
            case '-h':
                help();
                return;
        }

        i+=1;
    }

    if(id != null)
    getVideo(id, path, type, resolution);
    
}

main();
