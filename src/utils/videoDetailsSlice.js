import { createSlice } from "@reduxjs/toolkit";

const videoDetailsSlice = createSlice({
    name: 'videoDetails',
    initialState: {
        details: {}
    },
    reducers: {
        cacheVideoDetail: (state, action) => {
            if (action.payload && action.payload.id) {
                state.details[action.payload.id] = action.payload;
            }
        },
        clearVideoDetails: (state) => {
            state.details = {};
        }
    }
});

export const { cacheVideoDetail, clearVideoDetails } = videoDetailsSlice.actions;
export default videoDetailsSlice.reducer;
