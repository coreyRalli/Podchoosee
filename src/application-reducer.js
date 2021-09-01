export const ApplicationReducerActionTypes = {
    displayMinibar: 'action_display_minibar',
    hideMinibar: 'action_hide_minibar',
    updateNowPlayingMetadata: 'action_update_now_playing_metadata',
    loadNowPlaying: 'LOAD_NOW_PLAYING',
    displayApplicationError: 'DISPLAY_ERROR',
    displayLoadedAction: 'DISPLAY_LOADED',
    addDownload: 'action_add_download',
    downloadDownlaod: 'action_add_download'
}

export const defaultState = {
    minibarVisible: false,
    nowPlayingMetadata: {
        title: "N/A",
        podcastTitle: "N/A",
        artworkURL: "",
        podcastID: ""
    },
    hasApplicationError: false,
    applicationErrorMessage: '',
    viewState: "loading",
    preventMinibarClosing: false,
    downloads: []
}

export const reducer = (state, action) => {
    switch (action.type) {
        case ApplicationReducerActionTypes.displayMinibar:
            return {
                ...state,
                minibarVisible: true
            };
        case ApplicationReducerActionTypes.hideMinibar:
            return {
                ...state,
                minibarVisible: (state.preventMinibarClosing) ? true : false
            };
        case ApplicationReducerActionTypes.updateNowPlayingMetadata:
            return {
                ...state,
                nowPlayingMetadata: {
                    title: action.detail.title,
                    podcastTitle: action.detail.podcastTitle,
                    artworkURL: action.detail.artworkURL,
                    podcastID: action.detail.podcastID
                }
            };
        case ApplicationReducerActionTypes.loadNowPlaying:
            return {
                ...state,
                minibarVisible: true,
                nowPlayingMetadata: {
                    title: action.detail.title,
                    podcastTitle: action.detail.podcastTitle,
                    artworkURL: action.detail.artworkURL,
                    podcastID: action.detail.podcastID
                },
                preventMinibarClosing: action.detail.preventMinibarClosing
            }
        default:
            return state;
    }
}

export function createShowMinibarAction() {
    return {
        type: ApplicationReducerActionTypes.displayMinibar
    }
}

export function createHideMinibarAction() {
    return {
        type: ApplicationReducerActionTypes.hideMinibar
    }
}

export function createLoadNewEpisodeAction(track, preventMinibarClosing = false) {
    return {
        type: ApplicationReducerActionTypes.loadNowPlaying,
        detail: {
            title: track.title,
            podcastTitle: track.artist,
            artworkURL: track.artwork,
            podcastID: "",
            preventMinibarClosing: preventMinibarClosing
        }
    }
}

export function createAddDownloadAction(download) {

}

export function createRemoveDownloadAction(download) {
    
}