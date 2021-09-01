import React from 'react';
import { View, StyleSheet } from 'react-native';

import {
    Surface,
    Text,
    TouchableRipple,
    IconButton
} from 'react-native-paper';

import FastImage from 'react-native-fast-image';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TrackPlayer, { useTrackPlayerProgress } from 'react-native-track-player';

import textStyles from './text-styles';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flexDirection: 'row',
        left: 0,
        right: 0,
        height: 90,
        borderTopWidth: 1,
        borderTopColor: 'rgba(192,192,192,0.7)'
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 90
    },
    image: {
        backgroundColor: 'gray', 
        width: 80, 
        height: 80, 
        borderRadius: 4
    },
    infoContainer: {
        flex: 1, 
        justifyContent: 'center', 
        paddingLeft: 4, 
        paddingRight: 4
    },
    playPauseBtn: {
        width: 80, 
        alignItems: 'center', 
        justifyContent: 'center'
    }
});

// The actual UI is seperated from the state due to the way react-native-track-player works.
function MiniPlayerUI({ playbackState, metaData }) {
    const { position, bufferedPosition, duration } = useTrackPlayerProgress();

    const insets = useSafeAreaInsets();

    const _createFriendlyTime = () => {
        return (position <= 0 || duration <= 0) ? "Fetching..." : (_convertTime(position) + "/" + _convertTime(duration));
    }

    const _convertTime = (seconds) => {
        var date = new Date(1970,0,1);
        date.setSeconds(seconds);
        return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    }

    const _onPlayPausePress = () => {
        if (playbackState == "playing") {
            TrackPlayer.pause();
        } else if (playbackState == "paused") {
            TrackPlayer.play();
        }
    }

    return(<Surface style={{...styles.container, bottom: 50 + insets.bottom }}>
        <View style={styles.imageContainer}>
            <FastImage style={styles.image} source={{ uri: metaData.artworkURL }}/>
        </View>
        
        <TouchableRipple onPress={() => {}} style={styles.infoContainer}>
            <>
                <Text style={textStyles.title} numberOfLines={1}>{metaData.title}</Text>
                <Text style={textStyles.caption} numberOfLines={1}>{metaData.podcastTitle}</Text>
                <Text style={textStyles.description}>{_createFriendlyTime()}</Text>
            </>
        </TouchableRipple>

        {(playbackState != "starting") && <View style={styles.playPauseBtn}>
            <IconButton onPress={_onPlayPausePress} size={52} icon={(playbackState == "playing") ? "pause" : "play"}/>
        </View>}
    </Surface>);
}

export default MiniPlayerUI;