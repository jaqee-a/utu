import http from 'http';
import https from 'https';
import fs from 'fs';
import { WriteStream } from 'fs';
import ProgressBar from '../utils/progress.js';



export namespace HttpHelper {

    const REQUEST = (url: string) => url.startsWith('https') ? https : http;


    export async function get<T>(q: string): Promise<T> {
        const protocol = REQUEST(q);
        return new Promise<T>(async (resolve, reject) => {
            
            let output: string = "";
            protocol.get(q, (res) => {
                res.on('data', (chunk) => {
                    output+=chunk;
                });

                res.on('end', () => {
                    resolve(JSON.parse(output.replace('\n','')) as T);
                });

                res.on('error', (err) => {
                    reject(err);
                })
            });

        });
    }


    export async function download(q: string, file: string): Promise<boolean> {
        const protocol = REQUEST(q);
        return new Promise(async (resolve, reject) => {
            
            let downloaded: number = 0;

            protocol.get(q, async (res) => {

                if(res.statusCode === 301 || res.statusCode === 302)
                {
                    resolve(await download(res.headers.location!, file));
                    return;
                }

                const fileStream: WriteStream = fs.createWriteStream(file);

                const contentLn: number = parseInt(res.headers['content-length']!);

                const progress: ProgressBar = new ProgressBar(process.stdout, contentLn);

                res.on('data', (chunk: Buffer) => {
                    fileStream.write(chunk);
                    downloaded += chunk.length;
                    progress.render(downloaded, [`${chunk.length/1024}kb/s`]);
                });

                res.on('end', () => {
                    resolve(true);
                });

                res.on('error', (err) => {
                    reject(err);
                })
            });

        });
    }
}



