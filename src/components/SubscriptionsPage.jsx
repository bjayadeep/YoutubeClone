import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeMenu } from "../utils/appSlice";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import { YOUTUBE_SEARCH_API } from "../utils/contants";

const SubscriptionsPage = () => {
  const subscribedChannels = useSelector(
    (state) => state.subscriptions.channels
  );
  const dispatch = useDispatch();
  const [allSubscribedVideos, setAllSubscribedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nextPageTokensRef = useRef({});
  const [_, setNextPageTokensState] = useState({});

  const scrollRef = useRef(null);

  useEffect(() => {
    dispatch(closeMenu());
    setAllSubscribedVideos([]);
    setError(null);
    nextPageTokensRef.current = {};
    setNextPageTokensState({});

    const channelIds = Object.keys(subscribedChannels);

    if (channelIds.length > 0) {
      setLoading(true);
      fetchSubscribedChannelVideos(channelIds, false);
    } else {
      setLoading(false);
    }
  }, [subscribedChannels, dispatch]);

  const fetchSubscribedChannelVideos = useCallback(
    async (ids, append = false) => {
      if (loading && append) return;
      setLoading(true);
      setError(null);

      const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!API_KEY || API_KEY === "YOUR_API_KEY_PLACEHOLDER") {
        setError(
          "API Key is missing or invalid. Please check your .env file and constants.js."
        );
        setLoading(false);
        return;
      }

      const newTokensForThisFetch = {};
      const videoPromises = ids.map(async (channelId) => {
        let channelVideosUrl = `${YOUTUBE_SEARCH_API}&channelId=${channelId}&type=video&order=date&maxResults=5`;

        if (append && nextPageTokensRef.current[channelId]) {
          channelVideosUrl += `&pageToken=${nextPageTokensRef.current[channelId]}`;
        } else if (append && !nextPageTokensRef.current[channelId]) {
          return [];
        }

        try {
          const response = await fetch(channelVideosUrl);
          const json = await response.json();

          if (json.items) {
            const videos = json.items.filter(
              (item) => item.id.kind === "youtube#video"
            );
            newTokensForThisFetch[channelId] = json.nextPageToken || null;
            return videos;
          }
          return [];
        } catch (err) {
          console.error(
            `Failed to fetch videos for channel ${channelId}:`,
            err
          );
          return [];
        }
      });

      try {
        const results = await Promise.all(videoPromises);
        let combinedVideos = results.flat();

        nextPageTokensRef.current = {
          ...nextPageTokensRef.current,
          ...newTokensForThisFetch,
        };
        setNextPageTokensState(nextPageTokensRef.current);

        if (!append) {
          combinedVideos.sort((a, b) => {
            const dateA = new Date(a.snippet.publishTime);
            const dateB = new Date(b.snippet.publishTime);
            return dateB.getTime() - dateA.getTime();
          });
          setAllSubscribedVideos(combinedVideos);
        } else {
          setAllSubscribedVideos((prevVideos) => [
            ...prevVideos,
            ...combinedVideos,
          ]);
        }
      } catch (err) {
        setError("Failed to load all subscribed videos.");
        console.error("Error combining subscribed videos:", err);
      } finally {
        setLoading(false);
      }
    },
    [subscribedChannels, loading]
  );

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const hasMorePages = Object.values(nextPageTokensRef.current).some(
        (token) => token !== null
      );
      if (
        scrollHeight - scrollTop <= clientHeight + 100 &&
        !loading &&
        hasMorePages
      ) {
        const channelIdsToFetch = Object.keys(subscribedChannels).filter(
          (id) => nextPageTokensRef.current[id] !== null
        );
        fetchSubscribedChannelVideos(channelIdsToFetch, true);
      }
    }
  }, [loading, subscribedChannels, fetchSubscribedChannelVideos]);

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

  const channelEntries = Object.entries(subscribedChannels);

  if (loading && allSubscribedVideos.length === 0) {
    return (
      <div className="pt-[64px] px-4 py-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>
        <div className="text-xl text-gray-700">
          Loading subscribed videos...
        </div>
      </div>
    );
  }

  if (error && allSubscribedVideos.length === 0) {
    return (
      <div className="pt-[64px] px-4 py-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="h-[calc(100vh-64px)] overflow-y-auto px-4 py-4"
    >
      <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>

      {channelEntries.length === 0 ? (
        <p className="text-gray-700">
          You are not subscribed to any channels yet.
        </p>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="font-semibold text-xl mb-2">My Channels:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {channelEntries.map(([id, title]) => (
                <Link to={`/channel/${id}`} key={id}>
                  <div className="flex items-center p-3 shadow-sm rounded-lg bg-white hover:bg-gray-100 transition-colors duration-200">
                    <img
                      className="w-10 h-10 rounded-full mr-3"
                      src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                      alt={title}
                    />
                    <span className="font-semibold text-base">{title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h2 className="font-bold text-xl mb-4">
              Recent Videos from Subscriptions
            </h2>
            {allSubscribedVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {allSubscribedVideos.map((video) => (
                  <VideoCard key={video.id.videoId} info={video} />
                ))}
              </div>
            ) : (
              !loading &&
              !error && (
                <p className="text-gray-700">
                  No recent videos found from your subscriptions.
                </p>
              )
            )}
          </div>
        </>
      )}
      {loading && allSubscribedVideos.length > 0 && (
        <div className="text-center w-full py-4 col-span-full text-gray-500">
          Loading more subscribed videos...
        </div>
      )}
      {error && allSubscribedVideos.length > 0 && (
        <div className="text-center w-full py-4 col-span-full text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
