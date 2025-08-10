// src/utils/searchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: 'search',
    // The initial state will be an empty object, where keys are search queries
    // and values are arrays of suggestions for that query.
    initialState: {},
    reducers: {
        // The payload for cacheResults is expected to be an object like:
        // { "query_string": ["suggestion1", "suggestion2"] }
        cacheResults: (state, action) => {
            // Using Object.assign allows us to directly mutate the state (thanks to Immer in Redux Toolkit)
            // It merges the new cache entry into the existing state.
            Object.assign(state, action.payload);

            // Optional: Implement a simple cache size limit (e.g., keep only the last 100 entries).
            // This is a basic form of eviction to prevent the cache from consuming too much memory.
            const keys = Object.keys(state);
            const MAX_CACHE_SIZE = 100; // Define your desired max cache size here

            if (keys.length > MAX_CACHE_SIZE) {
                // For a basic cache, we'll remove the oldest entries based on their order in Object.keys().
                // This is a simple FIFO (First-In, First-Out) like eviction for this object-based cache.
                for (let i = 0; i < keys.length - MAX_CACHE_SIZE; i++) {
                    delete state[keys[i]]; // Delete the oldest key
                }
            }
        }
    }
});

export const {cacheResults} = searchSlice.actions;

export default searchSlice.reducer;
