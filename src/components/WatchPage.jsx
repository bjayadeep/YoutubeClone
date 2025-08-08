import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeMenu } from "../utils/appSlice";
import { useSearchParams } from "react-router-dom";
import { YOUTUBE_VIDEO_DETAILS_API } from "../utils/contants";

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const [videoDetails, setVideoDetails] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(closeMenu());
    getVideoDetails();
  }, [videoId]);

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
    return <div>Loading...</div>; 
  }

  const { snippet, statistics } = videoDetails;

  return (
    <div className="px-28">
      <div className="flex justify-center">
        <div className="w-[1000px] h-auto aspect-video">
          <iframe
            className="w-full h-full rounded-xl"
            src={"https://www.youtube.com/embed/" + videoId + "?autoplay=1"}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      
      <div className="mt-4">
        <h1 className="font-bold text-2xl">{snippet.title}</h1>
        <p className="text-gray-600 text-lg">{snippet.channelTitle}</p>
        <p className="text-gray-500 text-sm">{statistics.viewCount} views</p>
      </div>
    </div>
  );
};

export default WatchPage;