import React, { memo } from 'react';

import textStyles from '../text-styles';
import listViewStyles from './list-item-style';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';

import {
    View
} from 'react-native';

import {
    Text,
    ProgressBar,
    IconButton
} from 'react-native-paper';

import FastImage from 'react-native-fast-image';

import { cancelDownload, resumeDownload, pauseDownload, createAndStartDownload } from '../../utils/api';

import DownloadManager from '../../utils/download-manager';

const Download = ({ episode }) => {
    const _setDownloadStatus = () => {
        console.log(episode.downloadProgress / 100);
        
        switch (episode.downloadStatus) {
            case 'begin':
                return 'Queued';
            case 'progress':
                return `${episode.downloadProgress}% complete`;
            case 'paused':
                return `Download Paused: ${episode.downloadProgress}% complete`;
            case 'complete':
                return 'Download Complete';
            case 'error':
                return 'Download Error';
            default:
                return 'Download Status Unknown.';
        }
    }

    const _setResumePauseIcon = () => {
        switch (episode.downloadStatus) {
            case "begin":
            case "progress":
                return 'pause';
            case "paused":
                return 'play';
            case "error":
                return 'autorenew';
            default:
                return 'pause';
        }
    }

    const _onCancelPress = () => {
        cancelDownload(episode);
    }

    const _onPauseResumePress = () => {
        if (episode.downloadStatus == "paused") {
            resumeDownload(episode);
        } else if (episode.downloadStatus == "progress" || episode.downloadStatus == "begin") {
            pauseDownload(episode);
        } else if (episode.downloadStatus == "error") {
            createAndStartDownload(episode);
        }
    }

    return(<View style={listViewStyles.container}>
        <View style={listViewStyles.imageContainer}>
            <FastImage style={listViewStyles.image} source={{ uri: episode.imageUrl }}/>
        </View>
        
        <View style={listViewStyles.contentContainer}>
            <>
                <Text style={textStyles.title} numberOfLines={3}>{episode.title}</Text>
                <Text style={textStyles.caption} numberOfLines={1}>Podcast title goes here...</Text>
                <Text style={{...textStyles.caption, marginBottom: 8}}>{_setDownloadStatus()}</Text>
                <ProgressBar progress={episode.downloadProgress / 100} color={"#0099CC"} style={{ width: '100%' }}/>
            </>
        </View>

        <View style={listViewStyles.menuBtn}>
            <IconButton onPress={_onPauseResumePress} icon={_setResumePauseIcon()}/>
        </View>

        <View style={listViewStyles.menuBtn}>
            <IconButton onPress={_onCancelPress} icon="close" />
        </View>
    </View>);
}

export default memo(withDatabase(withObservables([], ({ episode }) => ({
    episode
}))(Download)));