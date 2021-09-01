import React, { useContext, useState } from 'react';

import { useTrackPlayerEvents, TrackPlayerEvents } from 'react-native-track-player';

import Context from '../application-context';
import MiniPlayerUI from './mini-player-ui';

function MiniPlayer() {
    const [ playbackState, setPlaybackState ] = useState("starting");
    
    useTrackPlayerEvents([TrackPlayerEvents.PLAYBACK_STATE], (event) => {
        if (event.type == "playback-state") {
            if (event.state == 3) {
                setPlaybackState('playing');
            } else if (event.state == 2) {
                setPlaybackState('paused');
            }
        }
    });

    const context = useContext(Context);
    
    return(
        <MiniPlayerUI playbackState={playbackState} metaData={context.appState.nowPlayingMetadata}/>
    );
}

export default MiniPlayer;