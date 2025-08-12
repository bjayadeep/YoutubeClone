import { createSlice } from "@reduxjs/toolkit";

const likedVideosSlice = createSlice({
    name: 'likedVideos',
    initialState: {
        videos: {}
    },
    reducers: {
        likeVideo: (state, action) => {
            state.videos[action.payload] = true;
        },
        unlikeVideo: (state, action) => {
            delete state.videos[action.payload];
        },
        clearLikedVideos: (state) => {
            state.videos = {};
        }
    }
});

export const { likeVideo, unlikeVideo, clearLikedVideos } = likedVideosSlice.actions;
export default likedVideosSlice.reducer;