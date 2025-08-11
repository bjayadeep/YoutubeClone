import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeMenu } from "../utils/appSlice";
import { useSearchParams } from "react-router-dom";
import { YOUTUBE_VIDEO_DETAILS_API } from "../utils/contants";
import CommentsContainer from "./CommentsContainer";
import LiveChat from "./LiveChat"; 

const formatViewCount = (views) => {
  if (!views) return "0 views";
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
      <div className="flex justify-center items-center h-screen pt-[64px]">
        <div className="text-xl text-gray-700">Loading video...</div>
      </div>
    );
  }

  const { snippet, statistics } = videoDetails;

  return (

    <div className="flex flex-col lg:flex-row w-full px-5 py-5 pt-[64px]">

      <div className="flex flex-col flex-1">
        <div className="w-full mb-6">
          <div className="relative pt-[56.25%]">
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

        <div className="flex flex-col mb-8">
          <h1 className="font-bold text-xl md:text-2xl mb-2">{snippet.title}</h1>
          <div className="flex items-center text-gray-700 text-sm mb-2">
            <p className="font-semibold text-lg">{snippet.channelTitle}</p>
            <span className="mx-2">•</span>
            <p className="text-gray-500">{formatViewCount(statistics.viewCount)}</p>
          </div>
          <div className="mt-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-800">
            <p className="line-clamp-3 hover:line-clamp-none transition-all duration-300 cursor-pointer">
              {snippet.description}
            </p>
          </div>
        </div>

        <div className="w-full">
          <CommentsContainer />
        </div>
      </div>

      <div className="w-full lg:w-[400px] lg:ml-8 mt-6 lg:mt-0"> {/* Adjusted width and margin for LiveChat */}
        <LiveChat />
      </div>

    </div>
  );
};

export default WatchPage;
