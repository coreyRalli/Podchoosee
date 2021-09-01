import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import * as Stacks from './tabs';

import { darkTheme, lightTheme } from '../application-theme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tabs = createMaterialBottomTabNavigator();

const BaseNavigation = () => {
    const _MyPodcastTabOptions = (options) => ({
        tabBarIcon: (props) => {
            let iconName = "";

            if (options.route.name == "My Podcasts") {
                iconName = props.focused ? 'radio' : 'radio';
            } else if (options.route.name == "Downloads") {
                iconName = props.focused ? 'download' : 'download';
            }

            return <Icon size={24} color={props.color} name={iconName} />
        }
    });

    const insets = useSafeAreaInsets();
    
    return(
        <NavigationContainer theme={darkTheme}>
            <Tabs.Navigator barStyle={{ paddingBottom: insets.bottom }}
                screenOptions={_MyPodcastTabOptions}>
                <Tabs.Screen name="My Podcasts" component={Stacks.MyPodcastsTabComponent}/>
                <Tabs.Screen name="Downloads" component={Stacks.DownloadsComponent} />
            </Tabs.Navigator>
        </NavigationContainer>
    );
}

export default BaseNavigation;