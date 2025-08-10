import React from "react";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);

  if (!isMenuOpen) return null;

  return (
    <div
      className="p-4 w-56 shadow-lg rounded-lg bg-white text-black min-h-screen z-50 fixed left-0 top-[76px] overflow-y-auto"
      style={{
        scrollbarWidth: "none", 
        msOverflowStyle: "none", 
      }}
    >
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      <ul className="space-y-4">
        <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">🏠 Home</li>
        <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">🔥 Trending</li>
        <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">🎵 Music</li>
        <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">🎮 Gaming</li>
        <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">📰 News</li>
        <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">🎥 Movies</li>
      </ul>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h2 className="font-bold mb-2">Subscriptions</h2>
        <ul className="space-y-4">
          <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">📺 Channel 1</li>
          <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">🎶 Channel 2</li>
          <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">⚽ Channel 3</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
