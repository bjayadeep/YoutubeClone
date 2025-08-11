import { createSlice } from "@reduxjs/toolkit";

const CHAT_MESSAGE_COUNT = 20; 

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: []
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.unshift(action.payload);
            if (state.messages.length > CHAT_MESSAGE_COUNT) {
                state.messages.splice(CHAT_MESSAGE_COUNT, 1); // Remove 1 element from index CHAT_MESSAGE_COUNT
            }
        },
        clearChat: (state) => {
            state.messages = [];
        }
    }
})

export const { addMessage, clearChat } = chatSlice.actions; // Export clearChat action
export default chatSlice.reducer;
