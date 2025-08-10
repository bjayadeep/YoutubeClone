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

      if (json.items) {
        setVideos(json.items);
      }
    } catch (error) {
      console.error("Failed to fetch YouTube videos:", error);
    }
  };

  return (
    <div className='flex flex-wrap justify-center md:justify-start pt-2'>
      {videos.length > 0 ? (
        videos.map(video => (
          <VideoCard key={video.id.videoId || video.id} info={video} />
        ))
      ) : (
        <div className="text-center w-full mt-20 text-gray-500">Loading videos...</div>
      )}
    </div>
  );
};

export default VideoContainer;
