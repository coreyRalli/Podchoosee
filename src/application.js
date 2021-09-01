import React, { useReducer, useEffect } from 'react';
import { StatusBar } from 'react-native';

import TrackPlayer, { useTrackPlayerEvents, TrackPlayerEvents } from 'react-native-track-player';

import {changeBarColors} from 'react-native-immersive-bars';

import {
    Provider as PaperProvider
} from 'react-native-paper';

import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { darkTheme, lightTheme } from './application-theme';

import Content from './navigation/base-navigation';

import PodchooseeDB from './database/podchooseeDB';

import * as AppReducer from './application-reducer';
import AppContext from './application-context';

import Minibar from './components/mini-player';

import RNBootSplash from "react-native-bootsplash";

const Application = () => {
    const [appState, dispatchAppStateAction] = useReducer(AppReducer.reducer, AppReducer.defaultState);
    
    useEffect(() => {
        changeBarColors(true, 'transparent', 'transparent');
        
        TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE, TrackPlayer.CAPABILITY_STOP],
            compactCapabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE]
        });

        // Temp function while I figure out what's going on...
        PodchooseeDB.recoverFromForceQuitWhilePlayingAsync()
        .then(() => {
            return RNBootSplash.hide({fade: true});
        })
        .catch((ex) => {
            console.log("Something went wrong: " + ex);
        })
    }, []);

    useTrackPlayerEvents([TrackPlayerEvents.PLAYBACK_STATE], (event) => {
        // Handle playback events to show the mini-player/player
        if (event.type == "playback-state") {
            if (event.state == 6) {
                TrackPlayer.getCurrentTrack()
                .then(( track ) => {
                    return (track) ? TrackPlayer.getTrack(track) : Promise.resolve(null);
                })
                .then((t) => {
                    if (t)
                        dispatchAppStateAction(AppReducer.createLoadNewEpisodeAction(t, false));
                })
            } else if (event.state == 4 || event.state == 0) {
                dispatchAppStateAction(AppReducer.createHideMinibarAction());
            }
        }
    });

    const displayMinibar = (episode, preventMinibarClosing) => {
        dispatchAppStateAction(AppReducer.createLoadNewEpisodeAction(episode, preventMinibarClosing));
    }

    return (
        <SafeAreaProvider>
            <AppContext.Provider value={{ appState, displayMinibar }}>
                <DatabaseProvider database={PodchooseeDB.database}>
                    <PaperProvider theme={darkTheme}>
                        <>
                            <StatusBar translucent={true} backgroundColor={"transparent"} barStyle={"light-content"}/>
                            <Content />

                            {(appState.minibarVisible) && <Minibar />}
                        </>
                    </PaperProvider>
                </DatabaseProvider>
            </AppContext.Provider>
        </SafeAreaProvider>
    );
}

export default Application;