import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        minHeight: 120
    },
    informationContainer: {
        minHeight: 120,
        flexDirection: 'row'
    },
    imageContainer: {
        width: 120,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        height: 100,
        width: 100,
        backgroundColor: 'gray',
        borderRadius: 8
    },
    titleContainer: {
        flex: 1,
        padding: 4,
        justifyContent: 'center'
    },
    title: {
        fontFamily: 'NunitoSans-Bold',
        fontSize: 18
    },
    author: {
        fontFamily: 'NunitoSans-Regular',
        fontSize: 12,
        opacity: 0.7
    },
    subBtn: {
        flex: 1,
        marginRight: 4
    }
});

export default styles;