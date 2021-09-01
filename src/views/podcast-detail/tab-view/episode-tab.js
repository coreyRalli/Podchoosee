import React, { useContext } from 'react';

import ViewContext from '../context';

import WrappedEpisodeFlatList from './episodeList';

const EpisodeTab = () => {
    const vContext = useContext(ViewContext);
    
    return(
        <WrappedEpisodeFlatList vContext={vContext} podcast={vContext.state.podcast}/>
    );
}

export default EpisodeTab;