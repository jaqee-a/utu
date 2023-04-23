

interface StatsSoftware {
    name: "invidious";
    version: string;
    branch: string;
}


interface StatsUsers {
    total: number;
    activeHalfyear: number;
    activeMonth: number;
}

interface StatsUsage {
    users: StatsUsers;
}

interface StatsMetaData {
    updatedAt: number;
    lastChannelRefreshedAt: number;
}

export interface Stats {
    version: string;
    software: StatsSoftware;
    openRegistration: boolean;
    usage: StatsUsage;
    metadata: StatsMetaData;
}


interface HasAuthor {
    author: string;
    authorId: string;
    authorUrl: string;
}

interface HasDescription {
    description: string;
    descriptionHtml: string;
}

interface HasAuthor {
    author: string;
    authorId: string;
    authorUrl: string;
}

interface HasTitle {
    title: string;
}

interface HasVideoCount {
    videoCount: number;
}

interface VideoThumbnail {
    quality: string;
    url: string;
    width: number;
    height: number;
}

interface AuthorThumbnail {
    url: string;
    width: number;
    height: number;
}

interface Video {
    videoId: string;
    lengthSeconds: number;
    VideoThumbnails: Array<VideoThumbnail>;
}

interface VideoExtended {
    type: "video";
    viewCount: number;
    published: number;
    publishedText: string;
    liveNow: boolean;
    paid: boolean;
    premium: boolean;
}


interface Playlist {
    type: "playlist";
    playlistId: string;
    playlistThumbnail: string;
    authorVerified: boolean;
    videos: Array<Video>;
}

interface Channel {
    type: "channel";
    authorThumbnail: Array<AuthorThumbnail>;
    autoGenerated: boolean;
    subCount: number;
}


export type VideoSearch    = Video & VideoExtended & HasTitle & HasAuthor & HasDescription;
export type PlaylistSearch = Playlist & HasTitle & HasAuthor & HasVideoCount;
export type ChannelSearch  = Channel & HasAuthor & HasDescription & HasVideoCount;

export type Search = Array<VideoSearch | PlaylistSearch | ChannelSearch>;


interface AdaptiveFormat {
    index: string;
    bitrate: string;
    init: string;
    url: string;
    itag: string;
    type: string;
    clen: string;
    lmt: string;
    projectionType: number;
    container: string;
    encoding: string;
    qualityLabel: string;
    resolution?: string;
}

export interface FormatStream {
    url: string;
    itag: string;
    type: string;
    quality: string;
    container: string;
    encoding: string;
    qualityLabel: string;
    resolution: string;
    size: string;
}

interface Caption {
    label: string;
    languageCode: string;
    url: string;
}

interface RecommendedVideo {
    author: string;
    viewCountText: string;
}

interface VideosIDExtended {
    keywords: Array<string>;
    likeCount: number;
    dislikeCount: number;
    isFamilyFriendly: boolean;
    allowedRegions: Array<string>;
    genre: string;
    genreUrl: string;
    authorThumbnails: Array<AuthorThumbnail>;
    allowRatings: boolean;
    rating: number;
    isListed: boolean;
    isUpcoming: boolean;
    premiereTimestamp?: number;
    hlsUrl: string;
    adaptiveFormats: Array<AdaptiveFormat>;
    formatStreams: Array<FormatStream>;
    captions: Array<Caption>;
    recommendedVideos: Array<RecommendedVideo & HasTitle & Video>;
    error?: string;
}


export type VideosID = HasTitle & Video & VideoExtended & HasDescription & HasAuthor & VideosIDExtended;
