export const sortTypes = {
    asIs: 'sort_as_is',
    lastPub: 'sort_last_pub'
}

import PodchooseeDatabase from '../database/podchooseeDB';
import apiKeys from './api-keys';

import { Q } from '@nozbe/watermelondb';

export async function fetchSearchResultsAsync(query) {
    try {
        const searchURL = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=podcast&entity=podcast&limit=200`;

        const apiResponse = await fetch(searchURL);
        const responseBody = await apiResponse.json();

        // Parse the search results
        const results = responseBody.results.map((sr) => {
            return {
                title: sr.trackName,
                author: sr.artistName,
                feedUrl: sr.feedUrl,
                genre: sr.primaryGenreName,
                contentRating: sr.contentAdvisoryRating,
                artwork: sr.artworkUrl100,
                id: sr.trackId,
                lastPub: convertPubDate(sr.releaseDate)
            };
        });

        return results;
    }
    catch (ex) {
        throw new Error(ex);
    }
}

function convertPubDate(date) {
    var d = new Date(date);

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const pubDate = d.getDate() + " " + months[d.getMonth()] + ' ' + d.getFullYear();

    return pubDate;
}

export async function fetchAndCacheSubscriptionAsync(feedUrl) {
    try {
        const localSubscription = await PodchooseeDatabase.getSubscriptionIfExists(feedUrl);

        if (localSubscription)
            return localSubscription;

        const serverBody = await parseSubscriptionOnServerAsync(feedUrl, { skip: 0, take: 20, includeChannel: 'true' });

        // Splice the first episode to test the update function. Remember to delete this!
        serverBody.episodes.shift();

        const newFirstEpDate = convertPubDate(serverBody.episodes.pubDate);

        await PodchooseeDatabase.removeAllCachedSubscriptionsAsync();

        const cachedSubscription = await PodchooseeDatabase.insertSubscriptionAsync(serverBody.channel, serverBody.episodes, "cached");

        return cachedSubscription;
    }
    catch (ex) {
        throw new Error(ex);
    }
}

export async function insertNewEpisodesAsync(databaseID) {
    try {
        const subscription = await PodchooseeDatabase.subscriptionsCollection.find(databaseID);

        if (subscription) {
            const episodes = await subscription.episodes.fetch();

            const IDs = episodes.map((item) => {
                return item.serverID
            });

            var serverBody = await parseSubscriptionOnServerAsync(subscription.feedUrl, { includeChannel: "false", excludedEpisodeIDs: IDs });

            populateEmptyFields(serverBody.episodes, subscription.imageUrl);

            subscription.addEpisodes(serverBody.episodes);

            return subscription;
        }

        return null;
    }
    catch (ex) {
        throw ex;
    }
}

export async function getNewEpisodesAsync(podcast) {    
    try {    
        const latestEp = await PodchooseeDatabase.episodesCollection.query(
            Q.where('subscription_id', podcast.id),
            Q.experimentalSortBy('pub_at', Q.desc),
            Q.experimentalTake(1)
        ).fetch();

        if (latestEp.length > 0) {
            const date = latestEp[0].pubAt.toString();

            const serverResponse = await fetch("https://us-central1-podchosee.cloudfunctions.net/getNewEpisodes", {
                method: 'POST',
                headers: {
                    "Content-Type" : "application/json",
                    Accept : 'application/json',
                    Authorization: 'Bearer ' + apiKeys.firebaseFunctionAPIKey
                },
                body: JSON.stringify({ feedUrl: podcast.feedUrl, date: date })
            });

            const serverBody = await serverResponse.json();

            serverBody.episodes.forEach((i) => {
                console.log(convertPubDate(i.pubDate));
            })

            if (serverBody.hasUpdates) {
                populateEmptyFields(serverBody.episodes, podcast.imageUrl);
                podcast.addEpisodes(serverBody.episodes);
            }
        } else {
            // TODO: Get the last updated time from the podcast itself.
            
            throw "No episodes found"
        }
    }
    catch (ex) {
        throw ex;
    }
}

async function parseSubscriptionOnServerAsync(feedUrl, options) {
    try {
        const serverResponse = await fetch("https://us-central1-podchosee.cloudfunctions.net/parsePodcast", {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json",
                Accept : 'application/json',
                Authorization: 'Bearer ' + apiKeys.firebaseFunctionAPIKey
            },
            body: JSON.stringify({ feedUrl: feedUrl, options: options })
        });

        const serverBody = await serverResponse.json();
        serverBody.channel.feedUrl = feedUrl;

        populateEmptyFields(serverBody.episodes,serverBody.channel.imageUrl);

        return serverBody;
    }
    catch (ex) {
        throw ex;
    }
}

function populateEmptyFields(episodes, imageUrl) {
    for (let i = 0; i < episodes.length; i++) {
        episodes[i].playbackStatus = "unplayed";
        episodes[i].playbackPosition = 0;
        episodes[i].mediaDuration = 0;
        episodes[i].trueMediaDuration = 0;
        episodes[i].pubAt = new Date(episodes[i].pubDate);
        episodes[i].imageUrl = imageUrl;
        episodes[i].serverID = episodes[i].id
    }
}