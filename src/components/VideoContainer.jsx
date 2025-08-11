import React, { useEffect, useState } from 'react';
import { YOUTUBE_VIDEOS_API } from '../utils/contants';
import VideoCard from './VideoCard';
import { useSelector } from 'react-redux'; 

const VideoContainer = () => {
    const [videos, setVideos] = useState([]);
    const isMenuOpen = useSelector((store) => store.app.isMenuOpen); 

    useEffect(() => {
        getVideos();
    }, []);

    const getVideos = async () => {
        try {
            const data = await fetch(YOUTUBE_VIDEOS_API);
            const json = await data.json();

            if (json.items) {
                setVideos(json.items);
            }
        } catch (error) {
            console.error("Failed to fetch YouTube videos:", error);
        }
    };

    const gridColumnsClass = isMenuOpen
        ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

    return (
        <div className={`grid ${gridColumnsClass} gap-4`}>
            {videos.length > 0 ? (
                videos.map(video => (
                    <VideoCard key={video.id.videoId || video.id} info={video} />
                ))
            ) : (
                <div className="text-center w-full mt-20 text-gray-500 col-span-full">Loading videos...</div>
            )}
        </div>
    );
};

export default VideoContainer;
