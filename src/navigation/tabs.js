import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import AddPodcastView from '../views/add-podcast/view';
import PodcastDetailView from '../views/podcast-detail/view';
import AllEpisodesView from '../views/all-episodes/view';
import MyPodcastsView from '../views/my-podcasts/view';

import DownloadsView from '../views/downloads/view';

const MyPodcastsTab = createStackNavigator();
const DownloadsTab = createStackNavigator();

export const MyPodcastsTabComponent = () => {
    return (
        <MyPodcastsTab.Navigator>
            <MyPodcastsTab.Screen name="My Podcasts" component={MyPodcastsView} options={{ headerShown: false }}/>
            <MyPodcastsTab.Screen name="Add Podcast" component={AddPodcastView} options={{ headerShown: false }}/>
            <MyPodcastsTab.Screen name="Podcast Detail" component={PodcastDetailView} options={{ headerShown: false }}/>
            <MyPodcastsTab.Screen name="All Episodes" component={AllEpisodesView} options={{ headerShown: false }} />
        </MyPodcastsTab.Navigator>
    );
}

export const DownloadsComponent = () => {
    return (
        <DownloadsTab.Navigator>
            <DownloadsTab.Screen name="Downloads" component={DownloadsView} options={{ headerShown: false }}/>
        </DownloadsTab.Navigator>
    );
}