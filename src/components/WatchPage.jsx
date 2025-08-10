import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeMenu } from "../utils/appSlice"; 
import { useSearchParams } from "react-router-dom";
import { YOUTUBE_VIDEO_DETAILS_API } from "../utils/contants";

const formatViewCount = (views) => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M views';
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(0) + 'K views';
  }
  return views + ' views';
};

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v"); 
  const [videoDetails, setVideoDetails] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(closeMenu());
    getVideoDetails();
  }, [videoId, dispatch]); 

  const getVideoDetails = async () => {
    if (!videoId) return; 

    try {
      const response = await fetch(YOUTUBE_VIDEO_DETAILS_API + videoId);
      const json = await response.json();
      setVideoDetails(json.items[0]);
    } catch (error) {
      console.error("Failed to fetch video details:", error);
    }
  };

  if (!videoDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-700">Loading video...</div>
      </div>
    );
  }

  const { snippet, statistics } = videoDetails;

  return (
    
    <div className="flex flex-col lg:flex-row p-4 pt-4">
      <div className="flex-1 flex justify-center lg:justify-start">
        <div className="w-full max-w-[1200px] h-auto aspect-video">
          <iframe
            className="w-full h-full rounded-xl shadow-lg"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="mt-6 lg:mt-0 lg:ml-8 lg:w-96">
        <h1 className="font-bold text-2xl mb-2">{snippet.title}</h1>
        <p className="text-gray-600 text-lg mb-1">{snippet.channelTitle}</p>
        <p className="text-gray-500 text-sm">{formatViewCount(statistics.viewCount)}</p>

        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">Description</h2>
          <p className="text-gray-700 text-sm line-clamp-4 hover:line-clamp-none transition-all duration-300">
            {snippet.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
