import { Model } from '@nozbe/watermelondb'
import { field, children, action, relation, date } from '@nozbe/watermelondb/decorators';

export class Subscription extends Model {
    static table = 'subscriptions';
    static associations = {
        episodes: { type: 'has_many', foreignKey: 'subscription_id' }
    };

    @field("title")
    title;
    
    @field('description')
    description;

    @field('author')
    author;
    
    @field('link') 
    link;
    
    @field('is_explicit') 
    isExplicit;
    
    @field('image_url') 
    imageUrl;

    @field('copyright') 
    copyright;

    @field('feed_url')
    feedUrl;

    @children('episodes') 
    episodes;

    @field('storage_type')
    storageType;

    async destroyPermanently() {
        var eps = await this.episodes.fetch();

        await this.episodes.destroyAllPermanently();
        await super.destroyPermanently();
    }
    
    @action async subscribe() {
        await this.update(sub => {
            sub.storageType = "subscribed";
        });
    }

    @action async unsubscribe() {
        // This will flag the subscription to be removed next
        // time cached subscriptions are cleared.
        await this.update(sub => {
            sub.storageType = "cached"
        });
    }
    
    @action async addEpisodes(episodes) {
        try {
            var batchJobs = episodes.map((item) => {
                return this.collections.get('episodes').prepareCreate(ep => {
                    ep.title = item.title;
                    ep.description = item.description;
                    ep.author = item.author;
                    ep.serverID = item.serverID;
                    ep.link = item.link;
                    ep.imageUrl = item.imageUrl;
                    ep.copyright = item.copyright;
                    ep.subscription.set(this);
                    ep.mediaUrl = item.mediaUrl;
                    ep.mediaType = item.mediaType
                    ep.playbackStatus = item.playbackStatus
                    ep.playbackPosition = item.playbackPosition
                    ep.mediaDuration = item.mediaDuration;
                    ep.trueMediaDuration = item.trueMediaDuration;
                    ep.pubAt = item.pubAt;
                    ep.downloadStatus = 'undownloaded';
                    ep.downloadProgress = 0;
                });
            });

            await this.batch.apply(this, batchJobs);
        }
        catch (ex) {
            throw ex;
        }
    }
}

export class Episode extends Model {
    static table = "episodes";
    static associations = {
        subscriptions: { type: 'belongs_to', key: 'subscription_id' }
    }

    @relation('subscriptions', 'subscription_id') 
    subscription;

    _friendlyPubDate = "";
    get friendlyPubDate() {
        let state = "Unplayed";
        let pubDate = "20 Feb 2020";
        let ds;

        switch (this.downloadStatus) {
            case "begin":
                ds = "Queued";
                break;
            case 'complete':
                ds = "Downloaded";
                break;
            case 'progress':
                ds = `Downloading ${this.downloadProgress}%`;
                break;
            case 'error':
                ds = "Download Error";
                break;
            case 'undownloaded':
                ds = 'Undownloaded';
                break;
            case 'paused':
                ds = 'Paused';
                break;
            default:
                ds = 'Undownloaded';
                break;
        }
        
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        pubDate = this.pubAt.getDate() + " " + months[this.pubAt.getMonth()] + ' ' + this.pubAt.getFullYear();

        switch (this.playbackStatus) {
            case "unplayed":
                state = "Unplayed";
                break;
            case "starting":
                state = "Starting";
                break;
            case "paused":
                state = "Paused";
                break;
            case "partial":
                if (this.trueMediaDuration > 0 && this.playbackPosition > 0) {
                    var minutesLeft = ((this.trueMediaDuration - this.playbackPosition) / 60).toFixed(0);
                    state = minutesLeft + " min Left";
                } else { state = "Partial" }
                break;
            case "playing":
                state = "Playing";
                break;
            case "complete":
                state = "Complete";
                break;
        }

        return (state + " | " + pubDate + " | " + ds);
    }

    @field('title')
    title;

    @field('description')
    description;

    @field('author') 
    author;
    
    @field('link')
    link;

    @field('image_url') 
    imageUrl;

    @field('copyright') 
    copyright;
    
    @date('pub_at') 
    pubAt;

    @field('playback_status')
    playbackStatus;

    @field('playback_position')
    playbackPosition;

    @field('media_url')
    mediaUrl;

    @field('media_type')
    mediaType;

    @field('media_duration')
    mediaDuration;

    @field('true_media_duration')
    trueMediaDuration;

    @field('server_id')
    serverID;

    @field('download_status')
    downloadStatus;

    @field('download_progress')
    downloadProgress;

    @action async updatePlaybackStatus(playbackStatus, trackPosition) {
        await this.update(item => {
            item.playbackStatus = playbackStatus
            item.playbackPosition = trackPosition || 0
        });         
    }

    @action async updateTrueDuration(duration) {
        await this.update(item => {
            item.trueMediaDuration = duration;
        });
    }

    @action async updateDownloadStatus(status, progress) {
        await this.update(item => {
            item.downloadStatus = status;
            item.downloadProgress = progress || 0;
        });
    }
}