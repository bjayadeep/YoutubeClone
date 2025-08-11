import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard from './VideoCard';
import { YOUTUBE_SEARCH_API } from '../utils/contants';
import { useDispatch } from 'react-redux';
import { closeMenu } from '../utils/appSlice';
import { useSelector } from 'react-redux'; 

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search_query");
  const eventType = searchParams.get("event_type"); 
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen); 

  useEffect(() => {
    dispatch(closeMenu());
    if (searchQuery) {
      setLoading(true);
      setError(null);
      getSearchResults();
    } else {
      setVideos([]);
      setLoading(false);
    }
  }, [searchQuery, eventType, dispatch]);

  const getSearchResults = async () => {
    try {
      let apiUrl = YOUTUBE_SEARCH_API + encodeURIComponent(searchQuery);

      if (eventType) {
        apiUrl += `&eventType=${eventType}`;
      }

      const response = await fetch(apiUrl);
      const json = await response.json();

      if (json.items) {
        const videoResults = json.items.filter(item => item.id.kind === 'youtube#video');
        setVideos(videoResults);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error("Failed to fetch search results:", err);
      setError("Failed to load videos. Please try again later.");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen pt-[64px]">
        <div className="text-xl text-gray-700">Loading search results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen pt-[64px]">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!searchQuery) {
    return (
      <div className="flex justify-center items-center h-screen pt-[64px]">
        <div className="text-xl text-gray-700">Please enter a search query.</div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen pt-[64px]">
        <div className="text-xl text-gray-700">No videos found for "{searchQuery}".</div>
      </div>
    );
  }

  const gridColumnsClass = isMenuOpen
    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' // Fewer columns when sidebar is open
    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'; // More columns when sidebar is closed

  return (
    <div className={`grid ${gridColumnsClass} gap-4`}>
      {videos.map((video) => (
        <VideoCard key={video.id.videoId} info={video} />
      ))}
    </div>
  );
};

export default SearchResultsPage;
