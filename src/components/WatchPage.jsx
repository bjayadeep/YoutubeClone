// src/components/WatchPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeMenu } from "../utils/appSlice";
import { useSearchParams } from "react-router-dom";
import { YOUTUBE_VIDEO_DETAILS_API } from "../utils/contants";
import CommentsContainer from "./CommentsContainer"; // Ensure this import path is correct

// Helper function to format view counts for better readability
const formatViewCount = (views) => {
  if (!views) return "0 views"; // Handle undefined or null views
  const numViews = parseInt(views);
  if (numViews >= 1000000) {
    return (numViews / 1000000).toFixed(1) + 'M views';
  }
  if (numViews >= 1000) {
    return (numViews / 1000).toFixed(0) + 'K views';
  }
  return numViews + ' views';
};

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v"); // Get video ID from URL query parameters
  const [videoDetails, setVideoDetails] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(closeMenu()); // Close sidebar when navigating to watch page
    getVideoDetails(); // Fetch video details when videoId changes
  }, [videoId, dispatch]); // Added dispatch to dependency array

  // Fetches detailed information for the selected video
  const getVideoDetails = async () => {
    if (!videoId) return;

    try {
      // Fetch using the proxy setup for YOUTUBE_VIDEO_DETAILS_API
      const response = await fetch(YOUTUBE_VIDEO_DETAILS_API + videoId);
      const json = await response.json();
      setVideoDetails(json.items[0]); // Set video details from API response
    } catch (error) {
      console.error("Failed to fetch video details:", error);
      // Optionally, display an error message to the user
    }
  };

  // Show a loading indicator while video details are being fetched
  if (!videoDetails) {
    return (
      <div className="flex justify-center items-center h-screen pt-[64px]"> {/* Adjust pt to account for fixed Head */}
        <div className="text-xl text-gray-700">Loading video...</div>
      </div>
    );
  }

  // Destructure snippet and statistics for easier access
  const { snippet, statistics } = videoDetails;

  return (
    // Main container for the watch page.
    // Use flex-col to stack video, details, and comments vertically.
    // px-5 for horizontal padding, pt-5 for spacing from the top (below Head).
    <div className="flex flex-col w-full px-5 py-5 pt-[64px] lg:px-10"> {/* Adjusted padding and fixed top space */}
      {/* Video Player Section: Takes full width, responsive aspect ratio */}
      <div className="w-full mb-6"> {/* Added bottom margin */}
        <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio container (height: 9/16 * width) */}
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Video Details Section: Title, Channel, Views, Description */}
      <div className="flex flex-col mb-8"> {/* Added bottom margin for spacing before comments */}
        <h1 className="font-bold text-xl md:text-2xl mb-2">{snippet.title}</h1> {/* Responsive font size */}
        <div className="flex items-center text-gray-700 text-sm mb-2"> {/* Group channel name and views */}
          <p className="font-semibold text-lg">{snippet.channelTitle}</p>
          <span className="mx-2">•</span> {/* Separator */}
          <p className="text-gray-500">{formatViewCount(statistics.viewCount)}</p>
        </div>

        {/* Description box */}
        <div className="mt-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-800">
          <p className="line-clamp-3 hover:line-clamp-none transition-all duration-300 cursor-pointer">
            {snippet.description}
          </p>
        </div>
      </div>

      {/* Comments Section */}
      <div className="w-full"> {/* Comments take full width below video and details */}
        <CommentsContainer /> {/* Render the comments component here */}
      </div>
    </div>
  );
};

export default WatchPage;
