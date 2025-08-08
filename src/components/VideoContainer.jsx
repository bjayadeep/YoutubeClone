import React, { useEffect, useState } from 'react';
import { YOUTUBE_VIDEOS_API } from '../utils/contants';
import VideoCard from './VideoCard';

const VideoContainer = () => {

    const [videos, setVideos] = useState([]);
    
    useEffect(() => {
        getVideos();
    }, []);

    const getVideos = async () => {
        try {
            const data = await fetch(YOUTUBE_VIDEOS_API);
            const json = await data.json();

            setVideos(json.items);
            
        } catch (error) {
            console.error("Failed to fetch YouTube videos:", error);
        }
    };

    return (
        <div className='flex flex-wrap'>
            {videos.map(video => (
                <VideoCard key={video.id} info={video} />
            ))}
        </div>
    );
};

export default VideoContainer;