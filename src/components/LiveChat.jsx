import React, { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../utils/chatSlice";
import { generateRandomString, generateRandomName, generateRandomMessage } from "../utils/helper";


const LiveChat = () => {
    const dispatch = useDispatch();
    const chatMessages = useSelector((store) => store.chat.messages);
    const [liveMessage, setLiveMessage] = useState("");

    useEffect(() => {
        const i = setInterval(() => {
            dispatch(
                addMessage({
                    name: generateRandomName(),
                    message: generateRandomMessage() + " " + generateRandomString(5),
                })
            );
        }, 1500);

        return () => clearInterval(i);
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (liveMessage.trim()) {
            dispatch(addMessage({
                name: "You (Jayadeep)",
                message: liveMessage.trim()
            }));
            setLiveMessage("");
        }
    };

    return (
        <div className="w-full border border-gray-300 bg-white rounded-lg">
            <div className="h-[500px] p-2 overflow-y-scroll flex flex-col-reverse">
                {chatMessages.map((c, index) => (
                    <ChatMessage key={index} name={c.name} message={c.message} />
                ))}
            </div>

            <form
                className="w-full p-2 border-t border-gray-300 flex"
                onSubmit={handleSendMessage}
            >
                <input
                    className="flex-1 border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    value={liveMessage}
                    onChange={(e) => setLiveMessage(e.target.value)}
                    placeholder="Say something..."
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 transition-colors duration-200">
                    Send
                </button>
            </form>
        </div>
    );
};

export default LiveChat;
