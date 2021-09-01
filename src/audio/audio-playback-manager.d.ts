import { Episode } from "../database/models";

interface Metadata {
    id: string;
    url: string;
    title: string;
    artist: string;
    artwork: string;
}

export function playNewEpisode(episode: Episode): Promise<void>;
export function shouldPlayerBeUpdateOnRestart() : Promise<{
    shouldUpdateTrack: boolean,
    metadata: Metadata
}>;