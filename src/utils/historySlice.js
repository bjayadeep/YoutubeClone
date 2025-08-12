import { createSlice } from "@reduxjs/toolkit";

const MAX_HISTORY_COUNT = 10; 

const historySlice = createSlice({
    name: 'history',
    initialState: {
        videos: []
    },
    reducers: {
        addHistory: (state, action) => {
            const videoId = action.payload;
            state.videos = state.videos.filter(id => id !== videoId);
            state.videos.unshift(videoId);
            if (state.videos.length > MAX_HISTORY_COUNT) {
                state.videos.pop(); 
            }
        },
        clearHistory: (state) => {
            state.videos = [];
        }
    }
});

export const { addHistory, clearHistory } = historySlice.actions;
export default historySlice.reducer;
