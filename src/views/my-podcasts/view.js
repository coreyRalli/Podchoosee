import React, { useContext } from 'react';
import { FlatList, StatusBar, View } from 'react-native';

import { Appbar, FAB } from 'react-native-paper';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { Q } from '@nozbe/watermelondb';

import Podcast from '../../components/list-items/podcast';

import { useNavigation } from '@react-navigation/native';

import * as R from 'ramda';

import AppContext from '../../application-context';

const alphabeticPodcastSort = R.sortWith([
    R.ascend(R.compose(R.toLower, R.prop('title')))
]);

const PodcastList = ({ podcasts }) => {
    const _renderItem = ({item}) => <Podcast onPress={_onPodcastPress} podcast={item}/>
    const _keyExtractor = (item, index) => item.id.toString();

    const navigation = useNavigation();

    const _onPodcastPress = (podcast) => {
        navigation.navigate('Podcast Detail', { feedUrl: podcast.feedUrl });
    }
    
    return(
        <FlatList data={alphabeticPodcastSort(podcasts)}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}/>
    );
}

const WrappedPodcastList = withDatabase(withObservables([], ({ database }) => ({
    podcasts: database.collections.get('subscriptions').query(
        Q.where('storage_type', Q.oneOf(['subscribed', 'downloadedCached']))
    ).observe()
}))(PodcastList));

const MyPodcastsView = ({ navigation, route }) => {
    const appContext = useContext(AppContext);
    
    const _onFABPress = () => {
        navigation.navigate("Add Podcast");
    }

    const _onBackPress = () => {
        if (navigation.canGoBack())
            navigation.goBack();
    }
    
    // The FAB can't be interacted with as a root item in a Fragment.
    return(
        <>
            <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
                {(navigation.canGoBack()) && <Appbar.BackAction onPress={_onBackPress}/>}

                <Appbar.Content title={"My Podcasts"}/>
            </Appbar.Header>

            <View style={{ flex: 1, paddingBottom: (appContext.appState.minibarVisible) ? 90 : 0 }}>
                <WrappedPodcastList />

                <FAB onPress={_onFABPress} 
                style={{ position: 'absolute', 
                bottom: 0, 
                right: 0,
                marginRight: 16, 
                marginBottom: (appContext.appState.minibarVisible) ? 106 : 16 }} 
                icon={"plus"}/>
            </View>
        </>
    )
}

export default MyPodcastsView;