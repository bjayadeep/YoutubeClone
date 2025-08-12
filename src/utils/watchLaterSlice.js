import { createSlice } from "@reduxjs/toolkit";

const watchLaterSlice = createSlice({
    name: 'watchLater',
    initialState: {
        videos: {}
    },
    reducers: {
        addToWatchLater: (state, action) => {
            state.videos[action.payload] = true; 
        },
        removeFromWatchLater: (state, action) => {
            delete state.videos[action.payload];
        },
        clearWatchLater: (state) => {
            state.videos = {};
        }
    }
});

export const { addToWatchLater, removeFromWatchLater, clearWatchLater } = watchLaterSlice.actions;
export default watchLaterSlice.reducer;
