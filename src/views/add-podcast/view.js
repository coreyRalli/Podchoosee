import React from 'react';
import { useReducer, useContext } from 'react';
import { Appbar, Menu, Searchbar } from 'react-native-paper';

import { viewStates } from '../../utils/consants';

import Loading from '../../components/view-states/loading';
import Error from '../../components/view-states/error';
import NoResults from '../../components/no-results';

import { reducer, defaultState, createDisplaySearchResultsAction, createUpdateQueryAction } from './reducer';
import { createDisplayLoadingAction, createDisplayErrorAction } from '../../utils/consants';

import SearchResult from '../../components/list-items/search-result';

import { fetchSearchResultsAsync } from '../../utils/api';
import { FlatList, StatusBar, View, StyleSheet } from 'react-native';

import AppContext from '../../application-context';

const styles = StyleSheet.create({
    searchbarStyle: {
        borderColor: 'rgba(192,192,192,0.7)',
        borderWidth: 1,
        margin: 8
    }
});

const AddPodcastView = ({ navigation }) => {
    const appContext = useContext(AppContext);
    
    const [state, dispatch] = useReducer(reducer, defaultState);

    const _renderItem = ({ item }) => <SearchResult onPress={_onPodcastPress} searchResult={item} />
    const _renderNoResults = () => <NoResults />

    const _renderContent = () => {
        switch (state.viewState) {
            case (viewStates.begin):
                return(
                    <View style={{ flex: 1 }}>
                    </View>
                )
            case (viewStates.loading):
                return (<Loading message={"Fetching search results..."}/>)
            case (viewStates.error):
                return(<Error message={"Something went wrong!"} retryAction={_onErrorRetryPress}/>)
            case (viewStates.loaded):
                return(
                    <FlatList   data={state.results}
                                ListEmptyComponent={_renderNoResults}
                                keyExtractor={(item,index) => index.toString()}
                                renderItem={_renderItem} />
                )
        }
    }

    const _handleFetch = () => {
        dispatch(createDisplayLoadingAction());

        fetchSearchResultsAsync(state.query)
        .then((sr) => {
            dispatch(createDisplaySearchResultsAction(sr));
        })
        .catch((ex) => {
            dispatch(createDisplayErrorAction("Something went wrong!"));
        })
    }

    // Event handlers
    const _updateQueryText = (text) => {
        dispatch(createUpdateQueryAction(text));
    }

    const _onSearchSubmit = () => {
        _handleFetch();
    }

    const _onBackPress = () => {
        if (navigation.canGoBack())
            navigation.goBack();
    }

    const _onErrorRetryPress = () => {
        _handleFetch();
    }

    const _onPodcastPress = (podcast) => {
        navigation.navigate("Podcast Detail", { feedUrl: podcast.feedUrl })
    }
    
    return(
        <>
            <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
                {(navigation.canGoBack()) && <Appbar.BackAction onPress={_onBackPress}/>}
                <Appbar.Content title={"Add Podcast"}/>
            </Appbar.Header>

            <Searchbar style={styles.searchbarStyle} 
            placeholder={"Search term or RSS URL"} 
            onChangeText={_updateQueryText}
            onSubmitEditing={_onSearchSubmit}
            value={state.query} 
            clearIcon={"close"}/>

            <View style={{ flex: 1, paddingBottom: (appContext.appState.minibarVisible) ? 90 : 0 }}>
            {_renderContent()}
            </View>
        </>
    );
}

export default AddPodcastView;