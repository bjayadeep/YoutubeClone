import { createSlice } from "@reduxjs/toolkit";

const MAX_LIST_CACHE_SIZE = 50; 

const videoListCacheSlice = createSlice({
    name: 'videoListCache',
    initialState: {
        lists: {}
    },
    reducers: {
        cacheVideoList: (state, action) => {
            const { key, videos, nextPageToken, append = false } = action.payload;

            if (!state.lists[key] || !append) {
                state.lists[key] = {
                    videos: videos, 
                    nextPageToken: nextPageToken || null,
                    lastFetched: Date.now()
                };
            } else {
                const currentVideoIds = new Set(state.lists[key].videos.map(v => v.id.videoId || v.id));
                const uniqueNewVideos = videos.filter(v => !currentVideoIds.has(v.id.videoId || v.id));

                state.lists[key].videos.push(...uniqueNewVideos);
                state.lists[key].nextPageToken = nextPageToken || null;
                state.lists[key].lastFetched = Date.now();
            }

            const listKeys = Object.keys(state.lists);
            if (listKeys.length > MAX_LIST_CACHE_SIZE) {
                let oldestKey = null;
                let oldestTimestamp = Infinity;
                for (const k of listKeys) {
                    if (state.lists[k].lastFetched < oldestTimestamp) {
                        oldestTimestamp = state.lists[k].lastFetched;
                        oldestKey = k;
                    }
                }
                if (oldestKey) {
                    delete state.lists[oldestKey];
                }
            }
        },
        clearVideoListCache: (state) => {
            state.lists = {};
        }
    }
});

export const { cacheVideoList, clearVideoListCache } = videoListCacheSlice.actions;
export default videoListCacheSlice.reducer;
