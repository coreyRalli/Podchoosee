import React from 'react';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';

import {
    FlatList,
} from 'react-native';
import { TouchableRipple, Text } from 'react-native-paper';

import Episode from '../../../components/list-items/episode';
import PodcastHeader from '../../../components/list-items/episode-list-header';

import * as R from 'ramda';

const pubDateSort = R.sort(R.descend(R.prop('pubAt')));

const EpisodeListFooter = ({ vContext }) => {
    const _onPress = () => {
        vContext.navigator.navigate("All Episodes", { id: vContext.state.podcast.id });
    }

    return(
        <TouchableRipple onPress={_onPress} style={{ height: 90, alignItems: 'center', justifyContent: 'center' }}>
            <Text>View All Episodes</Text>
        </TouchableRipple>
    )
}

const EpisodeFlatList = ({ podcast, episodes, vContext}) => {
    const _renderItem = ({ item }) => <Episode onPress={vContext.onEpisodePress} episode={item}/>
    const _renderHeader = () => <PodcastHeader isUpdating={vContext.state.isUpdatingPodcast} onUpdateBtnPress={vContext.onUpdateBtnPress} onSubscribeBtnPress={vContext.onSubscribeBtnPress} podcast={podcast}/>
    const _keyExtractor = (item, index) => index.toString();
    const _renderFooter = () => <EpisodeListFooter vContext={vContext}/> 

    return(
        <FlatList  data={pubDateSort(episodes)}
                keyExtractor={_keyExtractor}
                renderItem={_renderItem}
                ListFooterComponent={_renderFooter}
                ListHeaderComponent={_renderHeader}/>
    );
}

export default withDatabase(withObservables([], ({ podcast, episodes }) => ({
    podcast,
    episodes: podcast.episodes.observe()
}))(EpisodeFlatList));