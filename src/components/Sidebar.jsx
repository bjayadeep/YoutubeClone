import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);

  if (!isMenuOpen) return null;

  return (
    <div
      className="p-4 w-56 shadow-lg rounded-lg bg-white text-black min-h-screen z-50 fixed left-0 top-[64px] overflow-y-auto"
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

      <ul className="space-y-2 mb-4">
        <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Link to="/" className="flex items-center gap-2 w-full">🏠 Home</Link>
        </li>
        <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Link to="/results?search_query=trending" className="flex items-center gap-2 w-full">🔥 Trending</Link>
        </li>
        <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Link to="/results?search_query=music" className="flex items-center gap-2 w-full">🎵 Music</Link>
        </li>
        <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Link to="/results?search_query=gaming" className="flex items-center gap-2 w-full">🎮 Gaming</Link>
        </li>
        <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Link to="/results?search_query=news" className="flex items-center gap-2 w-full">📰 News</Link>
        </li>
        <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Link to="/results?search_query=movies" className="flex items-center gap-2 w-full">🎥 Movies</Link>
        </li>
      </ul>

      {/* Library */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h2 className="font-bold mb-2">Library</h2>
        <ul className="space-y-2">
            <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <Link to="/history" className="flex items-center gap-2 w-full">🕒 History</Link>
            </li>
            <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <Link to="/watch-later" className="flex items-center gap-2 w-full">⏰ Watch Later</Link>
            </li>
            <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <Link to="/liked-videos" className="flex items-center gap-2 w-full">👍 Liked Videos</Link>
            </li>
        </ul>
      </div>

      {/* Subscriptions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h2 className="font-bold mb-2">Subscriptions</h2>
        <ul className="space-y-2">
            <li className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <Link to="/subscriptions" className="flex items-center gap-2 w-full">📺 All Subscriptions</Link>
            </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
