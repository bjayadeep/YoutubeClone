import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: 'search',
   
    initialState: {},
    reducers: {
        
        cacheResults: (state, action) => {
            Object.assign(state, action.payload);
            const keys = Object.keys(state);
            const MAX_CACHE_SIZE = 100;

            if (keys.length > MAX_CACHE_SIZE) {
                
                for (let i = 0; i < keys.length - MAX_CACHE_SIZE; i++) {
                    delete state[keys[i]]; 
                }
            }
        }
    }
});

export const {cacheResults} = searchSlice.actions;

export default searchSlice.reducer;
