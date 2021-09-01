import React, { memo, useState } from 'react';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';

import DownloadManager from '../../utils/download-manager';

import {
    InteractionManager,
    View
} from 'react-native';

import {
    Menu,
    Text,
    TouchableRipple,
    IconButton
} from 'react-native-paper';

import textStyles from '../text-styles';
import listViewStyles from './list-item-style';

const Episode = ({episode, onPress}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    
    const _onPress = () => onPress(episode);

    const _onDownloadPress = () => {
        InteractionManager.runAfterInteractions(() => {
            setMenuOpen(false)

            if (episode.downloadStatus == "undownloaded" || episode.downloadStatus == "error") {
                DownloadManager.createDownload(episode)
                .then((downloadFunc) => {
                    return downloadFunc();
                });
            } else if (episode.downloadStatus == "begin" || episode.downloadStatus == "progress") {
                DownloadManager.stopDownload(episode);
            } else if (episode.downloadStatus == "complete") {
                DownloadManager.deleteDownload(episode);
            }
        });   
    }

    const _onPauseResumePress = () => {
        setMenuOpen(false);
        
        if (episode.downloadStatus == "paused") {
            DownloadManager.resumeDownload(episode);
        } else if (episode.downloadStatus == "progress") {
            DownloadManager.pauseDownload(episode);
        }
    }

    const _onMarkAsPlayedPress = () => {

    }

    const _setDownloadMenuItemText = () => {
        switch (episode.downloadStatus) {
            case 'begin':
                return "Cancel Download";
            case 'progress':
                return "Cancel Download";
            case 'undownloaded':
                return "Download Episode";
            case 'error':
                return "Retry Download";
            case 'complete':
                return "Delete Download";
            case 'paused':
                return 'Cancel Download';
            default:
                return "Download Episode";
        }
    }

    const _setMarkAsPlayedMenuItemText = () => {
        return "Mark as played";
    }

    const _setPauseResumeDownloadText = () => {
        if (episode.downloadStatus == "paused")
            return "Resume Download";
        
        if (episode.downloadStatus == "progress")
            return "Pause Download";
    }

    const _onMenuDismissed = () => {
        setMenuOpen(false);
    }

    const _openMenu = () => {
        setMenuOpen(true);
    }

    return(
        <View style={listViewStyles.container}>
            <TouchableRipple onPress={_onPress} style={listViewStyles.contentContainer}>
                <>
                    <Text style={textStyles.title} numberOfLines={3}>{episode.title}</Text>
                    <Text style={textStyles.caption}>{episode.friendlyPubDate}</Text>
                    <Text numberOfLines={2} style={textStyles.description}>{episode.description}</Text>
                </>
            </TouchableRipple>

            <View style={listViewStyles.menuBtn}>
                <Menu onDismiss={_onMenuDismissed} visible={menuOpen} anchor={<IconButton onPress={_openMenu} icon={"dots-vertical"}/>}>
                    <Menu.Item title={_setDownloadMenuItemText()} onPress={_onDownloadPress}/>

                    {(episode.downloadStatus == "progress" || episode.downloadStatus == "paused") &&
                    <Menu.Item onPress={_onPauseResumePress} title={_setPauseResumeDownloadText()} />}

                    <Menu.Item title={_setMarkAsPlayedMenuItemText()} onPress={_onMarkAsPlayedPress} />
                </Menu>
            </View>
        </View>
    )
}

export default memo(withDatabase(withObservables([], ({ episode }) => ({
    episode
}))(Episode)));