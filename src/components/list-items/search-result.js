import React, { memo } from 'react';

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

const searchResult = ({ searchResult, onPress }) => {
    const _onPress = () => onPress(searchResult);
    
    return (
        <View style={listViewItemStyles.container}>
            <View style={listViewItemStyles.imageContainer}>
                <FastImage style={listViewItemStyles.image} source={{ uri: searchResult.artwork }}/>
            </View>

            <TouchableRipple style={listViewItemStyles.contentContainer} onPress={_onPress}>
                <>
                    <Text numberOfLines={2} style={textStyles.title}>{searchResult.title}</Text>
                    <Text numberOfLines={2} style={{...textStyles.caption, marginBottom: 8}}>{searchResult.author}</Text>
                    <Text style={textStyles.caption}>{"Lastest Episode: " + searchResult.lastPub}</Text>
                </>
            </TouchableRipple>

            <View style={listViewItemStyles.menuBtn}>
                <Menu anchor={<IconButton onPress={() => {}} icon={"dots-vertical"}/>}>
                    <Menu.Item title={"Download"} icon={"download"}/>
                </Menu>
            </View>
        </View>
    );
}

export default memo(searchResult);