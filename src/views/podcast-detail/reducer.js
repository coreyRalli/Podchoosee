import { viewStates, commonActionNames } from '../../utils/consants';

export const defaultState = {
    viewState: viewStates.loading,
    podcast: null,
    isUpdatingPodcast: false
};

const podcastDetailActionNames = {
    displayPodcast: 'action_display_podcast',
    updateIsUpdating: 'action_update_isUpdating'
};

export const reducer = (state, action) => {
    switch (action.type) {
        case (commonActionNames.displayLoading):
            return {
                ...state,
                viewState: viewStates.loading
            }
        case (commonActionNames.displayError):
            return {
                ...state,
                viewState: viewStates.error,
                errorMessage: action.detail.message
            }
        case (podcastDetailActionNames.displayPodcast):
            return {
                ...state,
                viewState: viewStates.loaded,
                podcast: action.detail.podcast
            }
        case (podcastDetailActionNames.updateIsUpdating):
            return {
                ...state,
                isUpdatingPodcast: action.detail.isUpdating
            }
        default:
            return state;
    }
}

export function createDisplayPodcastAction(podcast) {
    return {
        type: podcastDetailActionNames.displayPodcast,
        detail: {
            podcast: podcast
        }
    };
}

export function createIsUpdatingAction(isUpdating) {
    return {
        type: podcastDetailActionNames.updateIsUpdating,
        detail: {
            isUpdating: isUpdating
        }
    };
}