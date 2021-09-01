import React, { useContext } from 'react';
import ViewContext from '../context';

import {
    ScrollView,
    TouchableOpacity,
    Linking
} from 'react-native';

import {
    Text
} from 'react-native-paper';

import textStyles from '../../../components/text-styles';

const AboutTab = () => {
    const vContext = useContext(ViewContext);

    const _onAboutWebsiteLink = () => {
        Linking.openURL(vContext.podcast.link)
        .catch(() => {});
    }
    
    return(
        <ScrollView>
            <Text style={textStyles.title}>{vContext.state.podcast.title}</Text>
            <Text style={textStyles.description}>{vContext.state.podcast.description}</Text>
            <Text style={textStyles.caption}>{vContext.state.podcast.copyright}</Text>

            <TouchableOpacity onPress={_onAboutWebsiteLink}>
                <Text style={textStyles.caption}>Website</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default AboutTab;