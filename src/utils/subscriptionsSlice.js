import { createSlice } from "@reduxjs/toolkit";

const subscriptionsSlice = createSlice({
    name: 'subscriptions',
    initialState: {
        channels: {}
    },
    reducers: {
        subscribe: (state, action) => {
            state.channels[action.payload.id] = action.payload.title;
        },
        unsubscribe: (state, action) => {
            delete state.channels[action.payload];
        },
        clearSubscriptions: (state) => {
            state.channels = {};
        }
    }
});

export const { subscribe, unsubscribe, clearSubscriptions } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
