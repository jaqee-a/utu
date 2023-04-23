import { FormatStream, Search, VideoSearch, VideosID } from "../models/invidious.models.js";
import { INVIDIOUS_INSTANCES } from "../utils/constants.js";
import { SEARCH_API, VIDEOSID_API } from "../utils/urls.js";
import { HttpHelper } from "./httpHelper.js";
import { exec } from "child_process";
import fs from 'fs';




export namespace Invidious {

    export async function searchVideo(q: string): Promise<Array<VideoSearch>> {
        const instance = INVIDIOUS_INSTANCES[0];
        const response = await HttpHelper.get<Search>(instance+SEARCH_API+'?q='+q);
        return response.filter((out) => out.type === 'video') as Array<VideoSearch>;
    }


    export async function getVideoQualities(video: VideoSearch): Promise<VideosID> {
        return getVideoQualitiesById(video.videoId);
    }

    export async function getVideoQualitiesById(id: string): Promise<VideosID> {
        const instance = INVIDIOUS_INSTANCES[0];
        
        const result = await HttpHelper.get<VideosID>(instance+VIDEOSID_API+'/'+id);
        result.formatStreams = result.formatStreams.filter((fs) => fs.container === 'mp4');

        return result;
    }


    export async function downloadVideo(video: FormatStream, file: string, isMp3: boolean = false) {
        const ext: string = video.container;
        try {
            await HttpHelper.download(video.url, `${file}.${ext}`);
        }catch{
            return;
        }

        if(isMp3) {
            exec(`ffmpeg -i "${file}.${ext}" "${file}.mp3"`, (error, _, stderr) => {
                if(error) {
                    console.error(stderr);
                    return;
                }
                fs.rmSync(`${file}.mp4`);
            });

        }
    }
}



