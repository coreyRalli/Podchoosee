import React from 'react';

import { View } from 'react-native';

import {
    Surface,
    Text,
    Button,
    ActivityIndicator
} from 'react-native-paper';

import FastImage from 'react-native-fast-image';

import styles from './episode-list-header-style'

function EpisodeListHeader({ podcast, onSubscribeBtnPress, onUpdateBtnPress, isUpdating }) {
    const _onSubBtnPress = () => onSubscribeBtnPress(podcast);
    const _onUpdateBtnPress = () => onUpdateBtnPress(podcast);
    
    return(
        <Surface style={styles.container}>
            <View style={styles.informationContainer}>
                <View style={styles.imageContainer}>
                    <FastImage source={{ uri: podcast.imageUrl }} style={styles.image}/>
                </View>

                <View style={styles.titleContainer}>
                    <Text numberOfLines={3} style={styles.title}>{podcast.title}</Text>
                    <Text numberOfLines={2} style={styles.author}>{podcast.author}</Text>
                </View>
            </View>

            <View style={{ paddingLeft: 4, paddingRight: 4, paddingTop: 8, paddingBottom: 8, flexDirection: 'row' }}>
                <Button style={styles.subBtn} onPress={_onSubBtnPress} mode={(podcast.storageType != "subscribed") ? "contained" : "outlined"}>
                    {(podcast.storageType != "subscribed") ? "subscribe" : 'subscribed'}
                </Button>

                {(!isUpdating) ? <Button onPress={_onUpdateBtnPress} disabled={isUpdating} mode={"contained"}>
                    Update
                </Button> : <ActivityIndicator size={'small'}/>}
            </View>
        </Surface>
    )
}

export default EpisodeListHeader;