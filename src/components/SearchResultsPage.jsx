import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard from './VideoCard';
import { YOUTUBE_SEARCH_API } from '../utils/contants';
import { useDispatch, useSelector } from 'react-redux';
import { closeMenu } from '../utils/appSlice';
import { cacheVideoList } from '../utils/videoListCacheSlice';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search_query");
    const eventType = searchParams.get("event_type");
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPageToken, setNextPageToken] = useState(null);

    const dispatch = useDispatch();
    const isMenuOpen = useSelector((store) => store.app.isMenuOpen);
    const videoListCache = useSelector(state => state.videoListCache.lists);

    const scrollRef = useRef(null);

    const cacheKey = `search:${searchQuery}${eventType ? `:${eventType}` : ''}`;

    const getSearchResults = useCallback(async (append = false) => {
        if (loading && append) return;
        setLoading(true);
        setError(null);

        if (!append && videoListCache[cacheKey] && videoListCache[cacheKey].videos.length > 0) {
            const cachedVideos = videoListCache[cacheKey].videos;
            const cachedNextPageToken = videoListCache[cacheKey].nextPageToken;

            setVideos(cachedVideos);
            setNextPageToken(cachedNextPageToken);
            setLoading(false);
            return;
        }

        let apiUrl = YOUTUBE_SEARCH_API;
        apiUrl += `&q=${encodeURIComponent(searchQuery)}`;
        if (eventType) {
            apiUrl += `&eventType=${eventType}`;
        }
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
                const newVideos = json.items.filter(item => item.id.kind === 'youtube#video');
                setVideos(prevVideos => append ? [...prevVideos, ...newVideos] : newVideos);
                setNextPageToken(json.nextPageToken || null);

                dispatch(cacheVideoList({
                    key: cacheKey,
                    videos: append ? [...videos, ...newVideos] : newVideos,
                    nextPageToken: json.nextPageToken,
                    append: append
                }));

            } else {
                setVideos(prevVideos => append ? prevVideos : []);
                console.warn("YouTube Search API response did not contain 'items' array.", json);
            }
        } catch (err) {
            console.error("Failed to fetch search results:", err);
            setError("Failed to load videos. Please try again later.");
            setVideos(prevVideos => append ? prevVideos : []);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, eventType, dispatch, cacheVideoList, cacheKey, loading, nextPageToken, videos]);

    useEffect(() => {
        dispatch(closeMenu());
        if (searchQuery) {
            setLoading(true);
            setError(null);
            getSearchResults(false);
        } else {
            setVideos([]);
            setLoading(false);
        }
    }, [searchQuery, getSearchResults, dispatch]);

    const handleScroll = useCallback(() => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollHeight - scrollTop <= clientHeight + 100 && !loading && nextPageToken) {
                getSearchResults(true);
            }
        }
    }, [loading, nextPageToken, getSearchResults]);

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, [handleScroll]);

    const gridColumnsClass = isMenuOpen
        ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

    if (loading && videos.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen pt-[64px]">
                <div className="text-xl text-gray-700">Loading search results...</div>
            </div>
        );
    }

    if (error && videos.length === 0) {
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

    return (
        <div ref={scrollRef} className='h-[calc(100vh-64px)] overflow-y-auto'>
            <div className={`grid ${gridColumnsClass} gap-4`}>
                {videos.map((video) => (
                    <VideoCard key={video.id.videoId} info={video} />
                ))}
            </div>
            {loading && <div className="text-center w-full py-4 col-span-full text-gray-500">Loading more videos...</div>}
            {error && <div className="text-center w-full py-4 col-span-full text-red-600">{error}</div>}
        </div>
    );
};

export default SearchResultsPage;
