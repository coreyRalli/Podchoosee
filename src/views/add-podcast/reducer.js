import { commonActionNames, viewStates } from '../../utils/consants';

const addPodcastActionNames = {
    fetchSearchResults: 'action_fetch_results',
    updateQuery: 'action_update_query'
}

const sortTypes = {
    asIs: 'sort_as_is',
    lastUpdated: 'sort_last_updated'
}

export const defaultState = {
    viewState: viewStates.begin,
    errorMessage: '',
    results: [],
    resultsLength: 0,
    query: '',
    sortType: sortTypes.asIs
}

export const reducer = (state,action) => {
    switch (action.type) {
        case commonActionNames.displayLoading:
            return {
                ...state,
                viewState: viewStates.loading,
                errorMessage: ''
            }
        case commonActionNames.displayError:
            return {
                ...state,
                viewState: viewStates.error,
                errorMessage: action.detail.message
            }
        case addPodcastActionNames.fetchSearchResults:
            return {
                ...state,
                viewState: viewStates.loaded,
                results: action.detail.results,
                resultsLength: action.detail.results.length
            }
        case addPodcastActionNames.updateQuery:
            return {
                ...state,
                query: action.detail.text
            }
        default:
            return state;
    }
}

export function createUpdateQueryAction(query) {
    return {
        type: addPodcastActionNames.updateQuery,
        detail: {
            text: query
        }
    }
}

export function createDisplaySearchResultsAction(results) {
    return {
        type: addPodcastActionNames.fetchSearchResults,
        detail: {
            results: results
        }
    }
}