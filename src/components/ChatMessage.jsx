import React from "react";

const ChatMessage = ({name, message}) => {
  return (
    <div className="flex items-center shadow-sm p-2 my-1 bg-gray-50 rounded-lg">
      <img
        className="h-6 w-6 rounded-full mr-2"
        alt="live-user-icon"
        src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
      />
      <span className="font-bold text-sm px-2 whitespace-nowrap">{name}</span>
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default ChatMessage;
