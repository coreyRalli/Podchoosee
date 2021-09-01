import React from 'react';

import {
    View,
    Image
} from 'react-native';

import {
    Text,
    Button
} from 'react-native-paper';

import textStyles from '../text-styles';

const Error = ({ message, retryAction }) => {
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../../assets/images/warning.png')}/>

            <Text style={textStyles.description}>
                {message}
            </Text>

            <Button onPress={retryAction} mode={"contained"}>
                Retry
            </Button>
        </View>
    )
}

export default Error;