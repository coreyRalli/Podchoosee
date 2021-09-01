import React, { memo } from 'react';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';

import {
    View
} from 'react-native';

import {
    Menu,
    Text,
    TouchableRipple,
    IconButton
} from 'react-native-paper';

import FastImage from 'react-native-fast-image';

import textStyles from '../text-styles';
import listViewItemStyles from './list-item-style';

const PodcastListItem = ({ podcast, onPress }) => {
    const _onPress = () => onPress(podcast);
    
    return(
        <View style={listViewItemStyles.container}>
            <View style={listViewItemStyles.imageContainer}>
                <FastImage style={listViewItemStyles.image} source={{ uri: podcast.imageUrl }}/>
            </View>

            <TouchableRipple style={listViewItemStyles.contentContainer} onPress={_onPress}>
                <>
                    <Text numberOfLines={2} style={textStyles.title}>{podcast.title}</Text>
                    <Text numberOfLines={2} style={{...textStyles.caption, marginBottom: 8}}>{podcast.author}</Text>
                </>
            </TouchableRipple>

            <View style={listViewItemStyles.menuBtn}>
                <Menu anchor={<IconButton onPress={() => {}} icon={"dots-vertical"}/>}>
                    
                </Menu>
            </View>
        </View>
    )
}

export default memo(withDatabase(withObservables([], ({ podcast }) => ({
    podcast
}))(PodcastListItem)));