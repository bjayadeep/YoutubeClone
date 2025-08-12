import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import searchSlice from "./searchSlice";
import chatSlice from "./chatSlice";
import likedVideosSlice from "./likedVideosSlice";
import watchLaterSlice from "./watchLaterSlice";
import historySlice from "./historySlice";
import subscriptionsSlice from "./subscriptionsSlice";
import videoDetailsSlice from "./videoDetailsSlice";     // NEW
import videoListCacheSlice from "./videoListCacheSlice"; // NEW

const store = configureStore({
    reducer: {
        app: appSlice,
        search: searchSlice,
        chat: chatSlice,
        likedVideos: likedVideosSlice,
        watchLater: watchLaterSlice,
        history: historySlice,
        subscriptions: subscriptionsSlice,
        videoDetails: videoDetailsSlice,      
        videoListCache: videoListCacheSlice,   
    },
});

export default store;
