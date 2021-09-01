import React from 'react';
import { FlatList } from 'react-native';

import Episode from '../../components/list-items/episode';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';

const AllEpisodesList = ({ podcast, episodes, onEpisodePress }) => {
    const _renderItem = ({ item }) => <Episode onPress={onEpisodePress} episode={item}/>
    const _keyExtractor = (item, index) => index.toString();
    
    return(
        <FlatList keyExtractor={_keyExtractor} renderItem={_renderItem} data={episodes}/>
    );
}

export default WrappedEpisodeFlatList = withDatabase(withObservables([], ({ podcast, episodes }) => ({
    podcast,
    episodes: podcast.episodes.observe()
}))(AllEpisodesList));