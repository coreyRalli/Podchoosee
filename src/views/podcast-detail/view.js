import React, { useContext, useEffect, useReducer } from 'react';

import ViewContext from './context';

import Error from '../../components/view-states/error';
import Loading from '../../components/view-states/loading';

import TabView from './tab-view/tab-view';

import { fetchAndCacheSubscriptionAsync, getNewEpisodesAsync } from '../../utils/api';

import { playNewEpisode } from '../../audio/audio-playback-manager';

import {
    Appbar
} from 'react-native-paper';
import { InteractionManager, StatusBar, View } from 'react-native';

import { reducer, defaultState, createDisplayPodcastAction, createIsUpdatingAction } from './reducer';

import { viewStates, createDisplayErrorAction, createDisplayLoadingAction } from '../../utils/consants';

import AppContext from '../../application-context';

const PodcastDetailView = ({ navigation, route }) => {
    const [state, dispatch] = useReducer(reducer, defaultState);

    const appContext = useContext(AppContext);

    // Don't start fetching data until screen has transitioned and component mounted.
    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            _handleFetchPodcast()
            .then((p) => _handleUpdate(p))
            .catch((ex) => {});
        })

        return () => task.cancel;
    }, []);

    const _handleUpdate = async (p) => {
        try {
            dispatch(createIsUpdatingAction(true));

            await getNewEpisodesAsync(p);

            dispatch(createIsUpdatingAction(false));
        }
        catch (ex) {
            throw ex;
        }
    }

    const _handleFetchPodcast = async () => {
        try {
            dispatch(createDisplayLoadingAction());
            
            const p = await fetchAndCacheSubscriptionAsync(route.params.feedUrl)

            dispatch(createDisplayPodcastAction(p));

            return p;
        }
        catch (ex) {
            dispatch(createDisplayErrorAction("Something went wrong!"));

            throw ex;
        }
    }
    
    const _renderContent = () => {
        switch (state.viewState) {
            case (viewStates.loading):
                return (<Loading message={"Fetching podcast..."}/>)
            case (viewStates.error):
                return (<Error message={"Something went wrong!"} retryAction={_handleFetchPodcast}/>)
            case (viewStates.loaded):
                return (<TabView />)
        }
    }

    const _onEpisodePress = (episode) => {
        // Immediately show minibar instead waiting for podcast to start buffering.
        appContext.displayMinibar({
            title: episode.title,
            artist: state.podcast.title,
            artwork: state.podcast.imageUrl
        }, true);
        
        playNewEpisode(episode);
    }

    const _onUpdateBtnPress = (podcast) => {
        _handleUpdate(podcast);
    }

    const _onSubscribeBtnPress = () => {
        console.log("Now subscribing!");
        
        if (state.podcast.storageType != "subscribed") {
            state.podcast.subscribe()
            .catch((ex) => {
                
            });
        } else {
            state.podcast.unsubscribe()
            .catch((ex) => {
                
            });
        }
    }

    const _onBackButtonPress = () => {
        if (navigation.canGoBack())
            navigation.goBack();
    }
    
    return(
        <ViewContext.Provider value={{ state, onEpisodePress: _onEpisodePress, onSubscribeBtnPress: _onSubscribeBtnPress, navigator: navigation, onUpdateBtnPress: _onUpdateBtnPress }}>
            <>
                <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
                    {(navigation.canGoBack()) && <Appbar.BackAction onPress={_onBackButtonPress}/>}
                </Appbar.Header>

                <View style={{ flex: 1, paddingBottom: (appContext.appState.minibarVisible) ? 90 : 0 }}>
                    {_renderContent()}
                </View>
            </>
        </ViewContext.Provider>
    );
}

export default PodcastDetailView;