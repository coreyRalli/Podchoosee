import React, { useState, useEffect, useContext } from 'react';

import { viewStates } from '../../utils/consants';

import { insertNewEpisodesAsync } from '../../utils/api';

import Loading from '../../components/view-states/loading';
import Error from '../../components/view-states/error';

import EpisodeList from './episode-list';

import {
    Appbar
} from 'react-native-paper';
import { StatusBar, View } from 'react-native';

import { playNewEpisode } from '../../audio/audio-playback-manager';

import AppContext from '../../application-context';

const AllEpisodesView = ({ navigation, route }) => {
    const appContext = useContext(AppContext);
    
    const [state, setState] = useState({
        viewState: viewStates.loading,
        podcast: null,
        errorMessage: ""
    });

    const _handleInsertEpisode = () => {
        setState({
            ...state,
            viewState: viewStates.loading,
            errorMessage: ""
        });
        
        insertNewEpisodesAsync(route.params.id)
        .then((p) => {
            setState({
                ...state,
                viewState: viewStates.loaded,
                podcast: p
            });
        })
        .catch((ex) => {
            console.log(ex);
            
            setState({
                ...state,
                viewState: viewStates.error,
                errorMessage: "Something went wrong!"
            });
        });
    }

    useEffect(() => {
        _handleInsertEpisode();
    }, []);

    const _renderContent = () => {
        switch (state.viewState) {
            case viewStates.loading:
                return(<Loading message={"Fetching episodes..."}/>)
            case viewStates.error:
                return(<Error message={"Something went wrong!"} retryAction={_handleInsertEpisode}/>)
            case viewStates.loaded:
                return(<EpisodeList onEpisodePress={_onEpisodePress} podcast={state.podcast}/>)
        }
    }

    const _onEpisodePress = (episode) => {
        appContext.displayMinibar({
            title: episode.title,
            artist: state.podcast.title,
            artwork: state.podcast.imageUrl
        }, true);
        
        playNewEpisode(ep);
    }

    const _onBackPress = () => {
        if (navigation.canGoBack())
            navigation.goBack();
    }

    return(
        <>
            <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
                {(navigation.canGoBack()) && <Appbar.BackAction onPress={_onBackPress}/>}

                <Appbar.Content title={"All Episodes"}/>
            </Appbar.Header>

            <View style={{ flex: 1, paddingBottom: (appContext.appState.minibarVisible) ? 90 : 0 }}>
                {_renderContent()}
            </View>
        </>
    );
}

export default AllEpisodesView;