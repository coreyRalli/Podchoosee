import React from 'react';
import { useContext } from 'react';
import { Q } from '@nozbe/watermelondb';

import AppContext from '../../application-context';

import Download from '../../components/list-items/download';


import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';


import {
    FlatList, StatusBar, View
} from 'react-native';

import {
    Text,
    Appbar
} from 'react-native-paper';

const DownloadsList = ({ episodes }) => {
    const _renderItem = ({ item }) => <Download episode={item}/>
    
    return(
        <FlatList data={episodes} renderItem={_renderItem}/>
    );
}

const WrappedPodcastList = withDatabase(withObservables([], ({ database }) => ({
    episodes: database.collections.get('episodes').query(
        Q.where('download_status', Q.oneOf(['begin', 'progress', 'error', 'paused']))
    ).observe()
}))(DownloadsList));

const Downloads = ({ navigation, route }) => {
    const _onBackAction = () => {
        if (navigation.canGoBack())
            navigation.goBack();
    }

    const appContext = useContext(AppContext);
    
    return(
        <>
            <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
                {(navigation.canGoBack()) && <Appbar.BackAction onPress={_onBackAction}/>}

                <Appbar.Content title={'Downloads'} />
            </Appbar.Header>

            <View style={{ flex: 1, paddingBottom: (appContext.minibarVisible) ? 90 : 0 }}>
                <WrappedPodcastList />
            </View>
        </>
    )
}

export default Downloads;