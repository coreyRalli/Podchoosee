import { appSchema, tableSchema, AppSchema } from '@nozbe/watermelondb';

const podchooseeSchema = appSchema({
    version: 3,
    tables: [
        tableSchema({
            name: 'subscriptions',
            columns: [
                { name: 'title', type: 'string' },
                { name: 'description', type: 'string'},
                { name: 'author', type: 'string' },
                { name: 'link', type: 'string' },
                { name: 'is_explicit', type: 'string' },
                { name: 'image_url', type: 'string'},
                { name: 'copyright', type: 'string' },
                { name: 'feed_url', type: 'string' },
                { name: 'storage_type', type: 'string'}
            ]
        }),
        tableSchema({
            name: 'episodes',
            columns: [
                { name: 'title', type: 'string' },
                { name: 'description', type: 'string'},
                { name: 'author', type: 'string' },
                { name: 'link', type: 'string' },
                { name: 'image_url', type: 'string'},
                { name: 'copyright', type: 'string' },
                { name: 'pub_at', type: 'number' },
                { name: 'playback_status', type: 'string' },
                { name: 'playback_position', type: 'number'},
                { name: 'subscription_id', type: 'string', isIndexed: true },
                { name: 'media_url', type: 'string' },
                { name: 'media_type', type: 'string' },
                { name: 'media_duration', type: 'number' },
                { name: 'true_media_duration', type: 'number' },
                { name: 'server_id', type: 'string' },
                { name: 'download_status', type: 'string' },
                { name: 'download_progress', type : 'number' }
            ]
        })
    ]
});

export default podchooseeSchema;