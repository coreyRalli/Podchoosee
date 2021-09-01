import { DefaultTheme, configureFonts } from 'react-native-paper';

const fonts = {
    regular: {
        fontFamily: 'NunitoSans-Regular',
        fontWeight: 'normal'
    },
    medium: {
        fontFamily: 'NunitoSans-SemiBold',
        fontWeight: 'normal'
    },
    light: {
        fontFamily: 'NunitoSans-Light',
        fontWeight: 'normal'
    },
    thin: {
        fontFamily: 'NunitoSans-ExtraLight',
        fontWeight: 'normal'
    }
}

export const lightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#449DD1',
        accent: '#7D1538',
        text: 'black'
    },
    fonts: configureFonts({ web: fonts, ios: fonts, android: fonts }),
    animation: {
        scale: 1.0
    }
}

export const darkTheme = {
    ...DefaultTheme,
    dark: true,
    mode: 'exact',
    colors: {
        ...DefaultTheme.colors,
        primary: '#449DD1',
        accent: '#0099CC',
        text: 'white',
        background: 'black',
        surface: '#121212',
        placeholder: 'rgba(192,192,192,0.7)'
    },
    fonts: configureFonts({ web: fonts, ios:fonts, android: fonts }),
    animation: {
        scale: 1.0
    }
}