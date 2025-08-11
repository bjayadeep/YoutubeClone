import React from 'react';
import { Link } from 'react-router-dom';

const formatViewCount = (views) => {
  if (!views) return null; 
  const numViews = parseInt(views);
  if (numViews >= 1000000) {
    return (numViews / 1000000).toFixed(1) + 'M views';
  }
  if (numViews >= 1000) {
    return (numViews / 1000).toFixed(0) + 'K views';
  }
  return numViews + ' views';
};

const VideoCard = ({ info }) => {
  if (!info || !info.snippet || !info.id) {
    return null;
  }

  const videoId = info.id.videoId || info.id;

  const { snippet } = info;
  const { channelTitle, title, thumbnails } = snippet;

  const viewCount = info.statistics ? formatViewCount(info.statistics.viewCount) : null;

  return (
    <Link to={"/watch?v=" + videoId}> 
      <div className='p-2 m-2 w-72 shadow-lg rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200'>
        <img
          className='rounded-lg w-full h-40 object-cover'
          src={thumbnails.medium.url}
          alt="thumbnail"
        />
        <ul className='mt-2'>
          <li className='font-bold text-base line-clamp-2'>{title}</li>
          <li className='text-gray-600 text-sm'>{channelTitle}</li>
          {viewCount && <li className='text-gray-600 text-sm'>{viewCount}</li>}
        </ul>
      </div>
    </Link>
  );
};

export default VideoCard;
