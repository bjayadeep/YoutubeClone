import React, { useEffect, useState, useRef, useCallback } from "react";
import { YOUTUBE_VIDEO_DETAILS_API } from "../utils/contants";
import VideoCard from "./VideoCard";

const VideoListDisplay = ({ videoIds, title }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(20);

  const scrollRef = useRef(null);

  const fetchVideoDetails = useCallback(async (idsToFetch, append = false) => {
    if (idsToFetch.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const idsString = idsToFetch.join(",");
      const response = await fetch(YOUTUBE_VIDEO_DETAILS_API + idsString);
      const json = await response.json();

      if (json.items) {
        setVideos((prevVideos) =>
          append ? [...prevVideos, ...json.items] : json.items
        );
      } else {
        setVideos((prevVideos) => (append ? prevVideos : []));
        console.warn(
          "YouTube Video Details API response did not contain 'items' array.",
          json
        );
      }
    } catch (err) {
      console.error("Failed to fetch video details for list:", err);
      setError("Failed to load videos. Please try again later.");
      setVideos((prevVideos) => (append ? prevVideos : []));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setVideos([]);
    setDisplayCount(20);
    if (videoIds && videoIds.length > 0) {
      fetchVideoDetails(videoIds.slice(0, 20));
    } else {
      setLoading(false);
    }
  }, [videoIds, fetchVideoDetails]);

  useEffect(() => {
    if (displayCount > videos.length && videoIds.length > videos.length) {
      fetchVideoDetails(videoIds.slice(videos.length, displayCount), true);
    }
  }, [displayCount, videoIds, videos.length, fetchVideoDetails]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (
        scrollHeight - scrollTop <= clientHeight + 100 &&
        !loading &&
        displayCount < videoIds.length
      ) {
        setDisplayCount((prevCount) =>
          Math.min(prevCount + 20, videoIds.length)
        );
      }
    }
  }, [loading, displayCount, videoIds.length]);

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  if (loading && videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen py-10">
        <div className="text-xl text-gray-700">
          Loading {title || "videos"}...
        </div>
      </div>
    );
  }

  if (error && videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen py-10">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!videoIds || videoIds.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen py-10">
        <div className="text-xl text-gray-700">
          No {title || "videos"} found.
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="h-[calc(100vh-64px)] overflow-y-auto px-4 py-2"
    >
      <h1 className="text-2xl font-bold mb-4">{title || "Videos"}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.id} info={video} />
        ))}
      </div>
      {loading && (
        <div className="text-center w-full py-4 col-span-full text-gray-500">
          Loading more {title || "videos"}...
        </div>
      )}
      {error && (
        <div className="text-center w-full py-4 col-span-full text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default VideoListDisplay;
