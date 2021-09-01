export const viewStates = {
    loading: 'loading',
    error: 'error',
    loaded: 'loaded',
    begin: 'begin'
}

export const commonActionNames = {
    displayLoading: 'action_display_loading',
    displayError: 'action_display_error'
}

export function createDisplayLoadingAction() {
    return {
        type: commonActionNames.displayLoading
    }
}

export function createDisplayErrorAction(message) {
    return {
        type: commonActionNames.displayError,
        detail: {
            message: message
        }
    }
}

export const getFilename = (path) => {
    path = path.substring(path.lastIndexOf("/")+ 1);
    return (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];
}