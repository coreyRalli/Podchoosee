import { Collection, Database } from '@nozbe/watermelondb';
import { Episode, Subscription, SubscriptionStorageType } from './models';

interface RawServerSubscription {
    title: string;
    description: string;
    storageType: SubscriptionStorageType;
    author: string;
    link: string;
    isExplicit: string;
    imageUrl: string;
    copyright: string;
    feedUrl: string;
}

class PodchooseeDatabase {
    database: Database;
    
    episodesCollection: Collection;
    subscriptionCollection: Collection;

    removeAllCachedSubscriptionsAync(): Promise<void>;
    insertSubscriptionAsync(): Promise<Subscription>;
    unsubscribe(channel: Subscription, episodes: Episode[], storageType: SubscriptionStorageType) : Promise<void>;
    getSubscriptionIfExists(feedUrl: string): Promise<Subscription>;
    recoverFromForceQuitWhilePlayingAsync() : Promise<void>;
}