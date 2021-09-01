/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/application';
import {name as appName} from './app.json';

import 'react-native-gesture-handler';
import 'es6-symbol/implement'

import TrackPlayer from 'react-native-track-player';
import AudioService from './src/audio/background-audio-service';

// Inits the DB before hiding splash screen
import PodchooseDatabase from './src/database/podchooseeDB';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => AudioService);
