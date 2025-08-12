import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { closeMenu } from '../utils/appSlice';
import VideoCard from './VideoCard';
import { YOUTUBE_SEARCH_API } from '../utils/contants';

const ChannelPage = () => {
    const { channelId } = useParams();
    const dispatch = useDispatch();
    const [channelVideos, setChannelVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [channelTitle, setChannelTitle] = useState("Channel");
    const [nextPageToken, setNextPageToken] = useState(null);

    const isMenuOpen = useSelector((store) => store.app.isMenuOpen);
    const scrollRef = useRef(null);

    const fetchChannelVideos = useCallback(async (append = false) => {
        if (loading && append) return;
        setLoading(true);
        setError(null);

        const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
        if (!API_KEY || API_KEY === "YOUR_API_KEY_PLACEHOLDER") {
            setError("API Key is missing or invalid. Please check your .env file and constants.js.");
            setLoading(false);
            return;
        }

        let channelVideosUrl = `${YOUTUBE_SEARCH_API}&channelId=${channelId}&type=video&order=date&maxResults=10`; 
        if (append && nextPageToken) {
            channelVideosUrl += `&pageToken=${nextPageToken}`;
        } else if (append && !nextPageToken) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(channelVideosUrl);
            const json = await response.json();

            if (json.items) {
                const newVideos = json.items.filter(item => item.id.kind === 'youtube#video');
                setChannelVideos(prevVideos => append ? [...prevVideos, ...newVideos] : newVideos);
                setNextPageToken(json.nextPageToken || null);

                if (!append && newVideos.length > 0 && newVideos[0].snippet && newVideos[0].snippet.channelTitle) {
                    setChannelTitle(newVideos[0].snippet.channelTitle);
                } else if (!append) {
                    if (json.items.length > 0 && json.items[0].snippet && json.items[0].snippet.channelTitle) {
                        setChannelTitle(json.items[0].snippet.channelTitle);
                    } else {
                        setChannelTitle("Channel");
                    }
                }
            } else {
                setChannelVideos(prevVideos => append ? prevVideos : []);
                setChannelTitle("Channel");
                console.warn("YouTube Search API response for channel did not contain 'items' array or it was empty.", json);
            }
        } catch (err) {
            console.error("Failed to fetch channel videos:", err);
            setError("Failed to load channel videos. Please try again later. (Check API quota/key)");
            setChannelVideos(prevVideos => append ? prevVideos : []);
        } finally {
            setLoading(false);
        }
    }, [channelId, loading, nextPageToken, channelVideos]);

    useEffect(() => {
        dispatch(closeMenu());
        if (channelId) {
            setLoading(true);
            setError(null);
            setChannelVideos([]);
            setNextPageToken(null);
            fetchChannelVideos(false);
        } else {
            setLoading(false);
            setError("No channel ID provided in the URL.");
        }
    }, [channelId, dispatch, fetchChannelVideos]);

    const handleScroll = useCallback(() => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollHeight - scrollTop <= clientHeight + 100 && !loading && nextPageToken) {
                fetchChannelVideos(true);
            }
        }
    }, [loading, nextPageToken, fetchChannelVideos]);

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

    if (loading && channelVideos.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen pt-[64px]">
                <div className="text-xl text-gray-700">Loading {channelTitle} videos...</div>
            </div>
        );
    }

    if (error && channelVideos.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen pt-[64px]">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div ref={scrollRef} className='h-[calc(100vh-64px)] overflow-y-auto px-5 py-5'>
            <h1 className="text-3xl font-bold mb-4">{channelTitle} Videos</h1>
            <p className="text-gray-600 mb-6">Channel ID: {channelId}</p>

            {channelVideos.length > 0 ? (
                <div className={`grid ${gridColumnsClass} gap-4`}>
                    {channelVideos.map(video => (
                        <VideoCard key={video.id.videoId} info={video} />
                    ))}
                </div>
            ) : (
                !loading && !error && <p className="text-xl text-gray-700">No videos found for this channel.</p>
            )}
            {loading && <div className="text-center w-full py-4 col-span-full text-gray-500">Loading more videos...</div>}
            {error && <div className="text-center w-full py-4 col-span-full text-red-600">{error}</div>}
        </div>
    );
};

export default ChannelPage;
