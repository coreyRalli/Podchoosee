import Database from '../database/podchooseeDB';

import TrackPlayer from 'react-native-track-player';

export default async () => {
    let updateTimer;

    const _updatePlaybackTime = () => {
        _updateTimer()
        .then(() => {
            console.log("Updated playback time!");
        })
        .catch((ex) => {
            console.log("Something went wrong!");
        })
    }

    const _updateTimer = async () => {
        try {
            const playingTrack = await TrackPlayer.getCurrentTrack();
            if (playingTrack) {
                const ep = await Database.episodesCollection.find(playingTrack);
                const pos = await TrackPlayer.getPosition();
    
                if (ep)
                    await ep.updatePlaybackStatus("playing", pos);
            }
        }
        catch (ex) {
            throw ex;
        }
    }

    TrackPlayer.addEventListener("remote-play", () => {
        TrackPlayer.play();
    });

    TrackPlayer.addEventListener('remote-pause', () => {
        TrackPlayer.pause();
    });

    TrackPlayer.addEventListener('remote-stop', async () => {
        if (updateTimer) 
            clearInterval(updateTimer);
        
        // Because a 'stopped' track always returns '0' as the plackback position, and the 'stopped' state change event is triggered at some weird times, this
        // is the one notification UI event we'll need to update the playback position from.
        const position = await TrackPlayer.getPosition();
        const id = await TrackPlayer.getCurrentTrack();

        TrackPlayer.stop();

        try {
            var ep = await Database.episodesCollection.find(id);
            await ep.updatePlaybackStatus("partial", position);

            console.log("Successfully updated episode to position: " + position);
        }
        catch (ex) { console.log("Something went wrong while updating episode position"); }
    });

    TrackPlayer.addEventListener('playback-queue-ended', async (e) => {
        if (e.track != null) {
            // Mark the playback as completed and reset to 0.
            try {
                const ep = await Database.episodesCollection.find(e.track);
                await ep.updatePlaybackStatus("complete", 0);
            }
            catch (ex) {
                console.log("Something went wrong while updating episode in queue ended event");
            }
        }
    });

    TrackPlayer.addEventListener('playback-state', async (e) => {
        const playingTrack = await TrackPlayer.getCurrentTrack();

        if (playingTrack) {
            try {
                const ep = await Database.episodesCollection.find(playingTrack);

                const pos = await TrackPlayer.getPosition();
                
                if (e.state == 0) {
                    // The playback has stopped, nothing is playing, or the Track Player has just started.
                    if (updateTimer) 
                        clearInterval(updateTimer);
                    return;
                }
                else if (e.state == 3) {
                    // Episode is playing
                    await ep.updatePlaybackStatus("playing", pos);

                    // The first time playing, update the 'true' duration, if can be found
                    if (ep.trueMediaDuration == 0) {
                        const duration = await TrackPlayer.getDuration();

                        if (duration != 0) {
                            await ep.updateTrueDuration(duration);
                        }
                    }

                    // Lastly add a timer for every 30 seconds to record the currently playing time, just in case the user closes the app in
                    // the ios/android app manager, or closes the app in Windows.
                    updateTimer = setInterval(_updatePlaybackTime, 30000);
                }
                else if (e.state == 2) {
                    if (updateTimer)
                        clearInterval(updateTimer);

                    // Episode is paused
                    await ep.updatePlaybackStatus("paused", pos);
                }
                else if (e.state == 6) {
                    if (ep.playbackPosition != 0) {
                        await TrackPlayer.seekTo(ep.playbackPosition);
                    }
                }
            }
            catch (ex) {
                console.log("Something happened while updating epsiode position within playback-state event");
            }
        }
    });

    console.log("Media Events registered!");
};