import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeMenu } from "../utils/appSlice";
import { useSearchParams, Link } from "react-router-dom";
import { YOUTUBE_VIDEO_DETAILS_API } from "../utils/contants";
import CommentsContainer from "./CommentsContainer";
import LiveChat from "./LiveChat";
import { likeVideo, unlikeVideo } from "../utils/likedVideosSlice";
import { addToWatchLater, removeFromWatchLater } from "../utils/watchLaterSlice";
import { addHistory } from "../utils/historySlice";
import { subscribe, unsubscribe } from "../utils/subscriptionsSlice";
import { cacheVideoDetail } from "../utils/videoDetailsSlice";
import { formatViewCount } from '../utils/helpers'; 

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const [videoDetails, setVideoDetails] = useState(null);

  const dispatch = useDispatch();
  const cachedDetails = useSelector(state => state.videoDetails.details[videoId]);

  const likedVideos = useSelector(state => state.likedVideos.videos);
  const watchLaterVideos = useSelector(state => state.watchLater.videos);
  const subscribedChannels = useSelector(state => state.subscriptions.channels);

  const isLiked = likedVideos[videoId] === true;
  const isWatchLater = watchLaterVideos[videoId] === true;
  const isSubscribed = videoDetails && subscribedChannels[videoDetails.snippet.channelId] !== undefined;

  const getVideoDetails = useCallback(async () => {
    if (!videoId) return;

    try {
      const response = await fetch(YOUTUBE_VIDEO_DETAILS_API + videoId);
      const json = await response.json();
      const details = json.items[0];
      setVideoDetails(details);
      if (details) {
        dispatch(cacheVideoDetail(details));
        dispatch(addHistory(videoId));
      }
    } catch (error) {
      console.error("Failed to fetch video details:", error);
    }
  }, [videoId, dispatch, cacheVideoDetail, addHistory]);

  useEffect(() => {
    dispatch(closeMenu());
    if (cachedDetails) {
      setVideoDetails(cachedDetails);
      dispatch(addHistory(videoId));
    } else {
      getVideoDetails();
    }
  }, [videoId, dispatch, cachedDetails, getVideoDetails]);

  const handleLike = () => {
    if (isLiked) {
      dispatch(unlikeVideo(videoId));
    } else {
      dispatch(likeVideo(videoId));
    }
  };

  const handleWatchLater = () => {
    if (isWatchLater) {
      dispatch(removeFromWatchLater(videoId));
    } else {
      dispatch(addToWatchLater(videoId));
    }
  };

  const handleSubscribe = () => {
    if (!videoDetails) return;
    const channelId = videoDetails.snippet.channelId;
    const channelTitle = videoDetails.snippet.channelTitle;

    if (isSubscribed) {
      dispatch(unsubscribe(channelId));
    } else {
      dispatch(subscribe({ id: channelId, title: channelTitle }));
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
        {/* Video Player */}
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

        {/* Video Details */}
        <div className="flex flex-col mb-4">
          <h1 className="font-bold text-xl md:text-2xl mb-2">{snippet.title}</h1>
          <div className="flex items-center text-gray-700 text-sm mb-2">
            <Link to={`/channel/${snippet.channelId}`} className="font-semibold text-lg hover:underline cursor-pointer">
                {snippet.channelTitle}
            </Link>
            <span className="mx-2">•</span>
            <p className="text-gray-500">{formatViewCount(statistics.viewCount)}</p>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={handleLike}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                isLiked ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              👍 {isLiked ? 'Liked' : 'Like'}
            </button>
            <button
              onClick={handleWatchLater}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                isWatchLater ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {isWatchLater ? 'Added to Watch Later' : 'Watch Later'}
            </button>
            <button
              onClick={handleSubscribe}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                isSubscribed ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } `}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Description box */}
          <div className="mt-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-800">
            <p className="line-clamp-3 hover:line-clamp-none transition-all duration-300 cursor-pointer">
              {snippet.description}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="w-full">
          <CommentsContainer />
        </div>
      </div>

      {/* Live Chat */}
      <div className="w-full lg:w-[400px] lg:ml-8 mt-6 lg:mt-0">
        <LiveChat />
      </div>

    </div>
  );
};

export default WatchPage;
