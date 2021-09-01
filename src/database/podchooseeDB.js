import { Database, Q } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { Episode, Subscription } from './models';

import Schema from './schema';

export class PodchooseeDatabase {
    database;
    
    adapter;

    episodesCollection;
    subscriptionsCollection;

    constructor() {
        this.adapter = new SQLiteAdapter({
            schema: Schema
        });
        
        this.database = new Database({
            adapter: this.adapter,
            modelClasses: [ Subscription, Episode ],
            actionsEnabled: true
        });

        this.episodesCollection = this.database.collections.get('episodes');
        this.subscriptionsCollection = this.database.collections.get('subscriptions');
    }

    async removeAllCachedSubscriptionsAsync() {
        await this.database.action(async () => {
            const subs = await this.subscriptionsCollection.query(Q.where('storage_type', "cached")).fetch();
            
            var batchedDeletes = [];

            subs.forEach((s) => {
                batchedDeletes.push(s.prepareDestroyPermanently());
            });

            await this.database.batch.apply(this.database, batchedDeletes);
        });
    }

    async insertSubscriptionAsync(channel, episodes, storageType) {
        try {
            let sub = new Subscription();

            await this.database.action(async () => {
                sub = await this.subscriptionsCollection.create(item => {
                    item.title = channel.title;
                    item.description = channel.description;
                    item.storageType = storageType;
                    item.author = channel.author;
                    item.link = channel.link;
                    item.isExplicit = channel.isExplicit;
                    item.imageUrl = channel.imageUrl;
                    item.copyright = channel.copyright;
                    item.feedUrl = channel.feedUrl;
                });
            });

            await sub.addEpisodes(episodes);

            return sub;
        }
        catch (ex) {
            throw ex;
        }
    }

    async unsubscribe(channel) {
        try {
            await this.database.action(async () => {
                await channel.destroyPermanently();
            });
        }
        catch (ex) {
            throw ex;
        }
    }

    async getSubscriptionIfExists(feedUrl) {
        try {
            var subQuery = await this.subscriptionsCollection.query(Q.where('feed_url', feedUrl)).fetch();

            if (subQuery.length == 0)
                return null;
                
            return subQuery[0];
        }
        catch (ex) {
            throw ex;
        }
    }

    async recoverFromForceQuitWhilePlayingAsync() {
        try {
            var query = await this.episodesCollection.query(Q.where('playback_status', Q.oneOf(['playing', 'paused']))).fetch();

            if (query.length == 0)
                return;

            // There should only really be one or two at most that need to be fixed.
            for (var i = 0; i < query.length; i++) {
                await query[i].updatePlaybackStatus('partial', query[i].playbackPosition);
            }
        }
        catch (ex) {
            throw ex;
        }
    }
}

const DBInstance = new PodchooseeDatabase();

export default DBInstance;