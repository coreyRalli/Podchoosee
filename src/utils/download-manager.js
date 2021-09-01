import { download } from 'react-native-background-downloader';
import { FileSystem } from 'react-native-unimodules';
import { getFilename } from './consants';

class DownloadManager {
    get downloads() {
        return this._downloads;
    }
    
    constructor() {
        this._downloads = [];
    }

    async createDownload(episode) {
        await episode.updateDownloadStatus('begin', 0);

        const parentPodcast = await episode.subscription.fetch();

        try { 
            await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}${parentPodcast.id}`, { intermediates: false }); 
        }
        catch {}

        const ext = getFilename(episode.mediaUrl).split('.').pop();

        const _callback = (progress) => {
            const percent = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
            this.onCallback(episode, percent);
        }

        const downloadable = FileSystem.createDownloadResumable(
            episode.mediaUrl,
            `${FileSystem.documentDirectory}${parentPodcast.id}/${episode.id}.${ext}`,
            {
                sessionType: FileSystem.FileSystemSessionType.BACKGROUND
            },
            _callback
        );

        const downloadableItem = {
            id: episode.id,
            downloadable: downloadable,
            status: 'normal',
            resumeData: null
        }

        this.downloads.push(downloadableItem);

        return async () => {
            try {
                await downloadable.downloadAsync();

                episode.updateDownloadStatus('complete', 0);

                const dlIndex = this.downloads.indexOf(downloadableItem);

                if (dlIndex != -1)
                    this.downloads.splice(dlIndex, 1);
            }
            catch (ex) {
                console.log(ex);
                
                console.log(downloadableItem.status);
                
                if (downloadableItem.status == "paused") {
                    if (episode.downloadStatus != "paused")
                        episode.updateDownloadStatus('paused', episode.downloadProgress);
                    return;
                }
                else if (downloadableItem.status == 'stopped') {
                    if (episode.downloadProgress != "undownloaded")
                        episode.updateDownloadStatus('undownloaded', 0);

                    await this.deleteDownload(episode);
                } 
                else {
                    console.log(ex);

                    episode.updateDownloadStatus('error', 0);

                    const dlIndex = this.downloads.indexOf(downloadableItem);

                    if (dlIndex != -1)
                        this.downloads.splice(dlIndex, 1);
                }
            }
        }
    }

    onCallback(episode, percent) {
        if (percent != 1) {
            const dl = this.getDownloadForEpisode(episode);

            if (dl.status == 'paused') {
                episode.updateDownloadStatus('paused', Math.round(percent * 100));
                
                return;
            } else if (dl.status == "stopped") {
                episode.updateDownloadStatus('undownloaded', 0);
            }
            
            episode.updateDownloadStatus('progress', Math.round(percent * 100));
        }
    }

    getDownloadForEpisode(episode) {
        for (let i = 0; i < this.downloads.length; i++) {
            if (this.downloads[i].id == episode.id)
                return this.downloads[i];
        }

        return null;
    }

    async pauseDownload(episode) {
        const dl = this.getDownloadForEpisode(episode);

        if (dl) {
            try {
                dl.status = "paused";

                let snapshot = await dl.downloadable.pauseAsync();

                dl.resumeData = JSON.stringify(snapshot);
            }
            catch (ex) {
                console.log('Something went wrong');
                throw ex;
            }
        }
    }

    async resumeDownload(episode) {
        const dl = this.getDownloadForEpisode(episode);

        if (dl) {
            if (dl.resumeData) {
                const resumableData = JSON.parse(dl.resumeData);

                const callback = (progress) => {
                    const percent = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
                    this.onCallback(episode, percent);
                }
                
                dl.downloadable = new FileSystem.DownloadResumable(
                    resumableData.url,
                    resumableData.fileUri,
                    resumableData.options,
                    callback,
                    resumableData.resumeData
                )

                dl.status = 'normal';

                try {
                    await dl.downloadable.resumeAsync();

                    episode.updateDownloadStatus('complete', 0);
                }
                catch (ex) {
                    console.log(downloadableItem.status);
                    
                    if (downloadableItem.status == "paused" || download.status == 'stopped') {
                        // Already handled by method.
                        return;
                    } else {
                        console.log(ex);

                        episode.updateDownloadStatus('error', 0);

                        const dlIndex = this.downloads.indexOf(downloadableItem);

                        if (dlIndex != -1)
                            this.downloads.splice(dlIndex, 1);
                    }
                }
            }
        }
    }

    async stopDownload(episode) {
        const dl = this.getDownloadForEpisode(episode);

        if (dl) {
            dl.status = 'stopped';

            await dl.downloadable.pauseAsync();
        }
    }

    async deleteDownload(episode) {
        try {
            const parentPodcast = await episode.subscription.fetch();
            
            const ext = getFilename(episode.mediaUrl).split('.').pop();
    
            await episode.updateDownloadStatus('undownloaded', 0);
            await FileSystem.deleteAsync(`${FileSystem.documentDirectory}${parentPodcast.id}/${episode.id}.${ext}`, { idempotent: true });
        }
        catch (ex) {
            console.log("Something went wrong while deleting download");
    
            throw ex;
        }
    }
}

export default new DownloadManager();