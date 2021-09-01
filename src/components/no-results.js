import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from 'react-native-paper';

import textStyles from './text-styles';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const NoResults = () => {
    return(
        <View style={styles.container}>
            <Text style={textStyles.title}>No results!</Text>
            <Text style={textStyles.description}>Try narrowing down your query</Text>
        </View>
    )
}

export default NoResults;