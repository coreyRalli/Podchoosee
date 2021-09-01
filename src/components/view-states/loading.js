import React from 'react';
import { View } from 'react-native';

import {
     ActivityIndicator,
     Text
} from 'react-native-paper';

import textStyle from '../text-styles';

const Loading = ({ message }) => {
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={'large'} animating={true} color={'#0099CC'}/>
            <Text>{message}</Text>
        </View>
    );
}

export default Loading;