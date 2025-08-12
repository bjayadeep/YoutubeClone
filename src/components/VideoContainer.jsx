import React, { useEffect, useState, useRef, useCallback } from "react";
import { YOUTUBE_VIDEOS_API } from "../utils/contants";
import VideoCard from "./VideoCard";
import { useSelector, useDispatch } from "react-redux";
import { cacheVideoList } from "../utils/videoListCacheSlice";

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);

  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);
  const dispatch = useDispatch();
  const videoListCache = useSelector((state) => state.videoListCache.lists);

  const scrollRef = useRef(null);
  const cacheKey = "popular";

  const getVideos = useCallback(
    async (append = false) => {
      if (loading && append) return;
      setLoading(true);
      setError(null);

      if (
        !append &&
        videoListCache[cacheKey] &&
        videoListCache[cacheKey].videos.length > 0
      ) {
        const cachedVideos = videoListCache[cacheKey].videos;
        const cachedNextPageToken = videoListCache[cacheKey].nextPageToken;

        setVideos(cachedVideos);
        setNextPageToken(cachedNextPageToken);
        setLoading(false);
        return;
      }

      let apiUrl = YOUTUBE_VIDEOS_API;
      if (append && nextPageToken) {
        apiUrl += `&pageToken=${nextPageToken}`;
      } else if (append && !nextPageToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(apiUrl);
        const json = await response.json();

        if (json.items) {
          const newVideos = json.items.filter((item) => item.id);
          setVideos((prevVideos) =>
            append ? [...prevVideos, ...newVideos] : newVideos
          );
          setNextPageToken(json.nextPageToken || null);

          dispatch(
            cacheVideoList({
              key: cacheKey,
              videos: append ? [...videos, ...newVideos] : newVideos,
              nextPageToken: json.nextPageToken,
              append: append,
            })
          );
        } else {
          setVideos((prevVideos) => (append ? prevVideos : []));
          console.warn(
            "YouTube Videos API response did not contain 'items' array.",
            json
          );
        }
      } catch (err) {
        console.error("Failed to fetch YouTube videos:", err);
        setError("Failed to load videos. Please try again later.");
        setVideos((prevVideos) => (append ? prevVideos : []));
      } finally {
        setLoading(false);
      }
    },
    [dispatch, cacheVideoList, cacheKey, loading, nextPageToken, videos]
  );

  useEffect(() => {
    getVideos(false);
  }, [getVideos]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (
        scrollHeight - scrollTop <= clientHeight + 100 &&
        !loading &&
        nextPageToken
      ) {
        getVideos(true);
      }
    }
  }, [loading, nextPageToken, getVideos]);

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

  const gridColumnsClass = isMenuOpen
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

  return (
    <div ref={scrollRef} className="h-[calc(100vh-64px)] overflow-y-auto">
      <div className={`grid ${gridColumnsClass} gap-4`}>
        {videos.length > 0
          ? videos.map((video) => <VideoCard key={video.id} info={video} />)
          : !loading &&
            !error && (
              <div className="text-center w-full mt-20 text-gray-500 col-span-full">
                No videos found.
              </div>
            )}
      </div>
      {loading && (
        <div className="text-center w-full py-4 col-span-full text-gray-500">
          Loading more videos...
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

export default VideoContainer;
