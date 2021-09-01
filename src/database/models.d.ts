import { Model } from '@nozbe/watermelondb';

type DownloadStatus = "undownloaded" | 'begin' | 'progress' | 'complete' | 'error' | 'paused';
type SubscriptionStorageType = "cached" | "subscribed";
type PlaybackStatus = "starting" | "starting" | "playing" | "paused" | "partial";

export class Subscription extends Model {
    title: string;
    description: string;
    author: string;
    link: string;
    isExplicit: string;
    imageUrl: string;
    copyright: string;
    feedUrl: string;
    episodes: Episode[];
    storageType: SubscriptionStorageType

    destroyPermanently() : Promise<void>;
    subscribe(): Promise<void>;
    unsubscribe(): Promise<void>;
    addEpisodes(episodes: Episode[]) : Promise<void>;
}

export class Episode extends Model {
    subscription: Subscription;

    get friendlyPubDate() : string;

    title: string;
    description: string;
    author: string;
    link: string;
    imageUrl: string;
    copyright: string;
    pubAt: string;
    playbackStatus: string;
    playbackPosition: string;
    mediaUrl: string;
    mediaType: string;
    mediaDuration: string;
    trueMediaDuration: number;
    serverID: string;
    downloadStatus: DownloadStatus
    downloadProgress: number;

    updatePlaybackStatus(playbackStatus: PlaybackStatus, trackPosition: number): Promise<void>;
    updateTrueDuration(duration: number): Promise<void>;
    updateDownloadStatus(status: DownloadStatus, progress: number);
}