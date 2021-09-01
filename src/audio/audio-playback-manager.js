import TrackPlayer from 'react-native-track-player';
import PodchooseeDatabase from '../database/podchooseeDB';

import { Q } from '@nozbe/watermelondb';

import { FileSystem } from 'react-native-unimodules';

import { getFilename } from '../utils/consants';

export async function playNewEpisode(episode) {
    // Init the player if it already hasn't
    //await TrackPlayer.setupPlayer();

    const currentlyPlayingTrack = await TrackPlayer.getCurrentTrack();

    console.log(currentlyPlayingTrack);

    if (currentlyPlayingTrack) {
        if (currentlyPlayingTrack == episode.id && (episode.playbackStatus == "playing" || episode.playbackStatus == "starting")) {
            console.log("Currently playing track does not need updating!");
            return;
        }

        try {
            // Save the currently playing episode's position
            const currentPlaybackPosition = await TrackPlayer.getPosition();

            if (currentPlaybackPosition != 0) {
                const dbEp = await PodchooseeDatabase.episodesCollection.find(currentlyPlayingTrack);
                await dbEp.updatePlaybackStatus("partial", currentPlaybackPosition);
            }
        }
        catch (ex) {
            console.log("Something went wrong while updating playing track... " + ex);
        }
    }

    try {
        console.log("Grabbing item to play");

        const podcast = await episode.subscription.fetch();

        const fn = getFilename(episode.mediaUrl).split('.').pop();

        const mediaUrl = (episode.downloadStatus == "complete") ? `${FileSystem.documentDirectory}${podcast.id}/${episode.id}.${fn}` : episode.mediaUrl;

        console.log('The media url is: ' + mediaUrl);
        
        const mediaMetadata = {
            id: episode.id,
            url: mediaUrl,
            title: episode.title,
            artist: podcast.title,
            artwork: podcast.imageUrl
        }

        await TrackPlayer.setupPlayer();
        
        await TrackPlayer.reset();

        await episode.updatePlaybackStatus("starting", episode.playbackPosition);

        await TrackPlayer.add(mediaMetadata);

        TrackPlayer.play();
    }
    catch (ex) {
        console.log(ex);
        console.log("Something went wrong while playing track...");
    }
}

export async function shouldPlayerBeUpdatedOnRestart() {
    // First, check to see if something is playing. Then check if what's playing matches. If not, update. (Otherwise, it's
    // simply the UI re-attaching and the minibar's own logic will take care of it).
    const currentlyPlayingTrack = await TrackPlayer.getCurrentTrack();

    if (currentlyPlayingTrack) {
        const playingEpisodes = await PodchooseeDatabase.episodesCollection.query(Q.where('playback_status', Q.oneOf(['playing', 'paused']))).fetch();

        if (playingEpisodes.length > 0) {
            for (var i = 0; i < playingEpisodes.length; i++) {
                if (playingEpisodes[i].id == currentlyPlayingTrack)
                    return;
            }
        }

        const updateMd = {
            id: playingEpisodes[0].id,
            url: playingEpisodes[0].mediaUrl,
            title: playingEpisodes[0].title,
            artist: playingEpisodes[0].author,
            artwork: playingEpisodes[0].imageUrl
        }

        // Update the track
        return {
            shouldUpdateTrack: true,
            metadata: updateMd
        }
    } else {
        // Check to see if there's an item in the database that's playing and prime the player so the user can immediately press play and start
        const episodes = await PodchooseeDatabase.episodesCollection.query(Q.where('playback_status', Q.oneOf(['playing', 'paused']))).fetch();

        if (episodes.length > 0) {
            // TODO: Handle a edge case where there may be multiple playing/paused episodes (especially when syncing).
            const ep = episodes[0];

            // Prime the player and add to playlist.
            const resumeMd = {
                id: ep.id,
                url: ep.mediaUrl,
                title: ep.title,
                artist: ep.author,
                artwork: ep.imageUrl
            }

            await TrackPlayer.setupPlayer();

            await TrackPlayer.add(resumeMd);

            return {
                shouldUpdateTrack: true,
                metadata: resumeMd
            }
        }
    }

    return {
        shouldUpdateTrack: false
    }
}