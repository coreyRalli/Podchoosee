import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        minHeight: 90,
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: 'rgba(192,192,192,0.7)'
    },
    contentContainer: {
        padding: 8,
        justifyContent: 'center',
        flex: 1
    },
    imageContainer: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 4,
        backgroundColor: 'gray'
    },
    menuBtn: {
        width: 42,
        borderColor: 'rgba(192,192,192,0.7)',
        marginTop: 12,
        marginBottom: 12,
        borderLeftWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default styles;