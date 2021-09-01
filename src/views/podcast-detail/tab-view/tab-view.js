import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import AboutTab from './about-tab';
import EpisodeTab from './episode-tab';

const Tabs = createMaterialTopTabNavigator();

const TabView = () => {
    return(
        <Tabs.Navigator>
            <Tabs.Screen name="Episodes" component={EpisodeTab}/>
            <Tabs.Screen name="About" component={AboutTab}/>
        </Tabs.Navigator>
    );
}

export default TabView;