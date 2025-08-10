import React from 'react';
import { Link } from 'react-router-dom';

const formatViewCount = (views) => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M views';
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(0) + 'K views';
  }
  return views + ' views';
};

const VideoCard = ({ info }) => {
  
  if (!info || !info.snippet || !info.statistics) {
    return null;
  }

  const { snippet, statistics } = info;
  const { channelTitle, title, thumbnails } = snippet;

  return (
    <Link to={"/watch?v=" + info.id}>
      <div className='p-2 m-2 w-72 shadow-lg rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200'>
        <img
          className='rounded-lg w-full h-40 object-cover'
          src={thumbnails.medium.url}
          alt="thumbnail"
        />
        <ul className='mt-2'>
          <li className='font-bold text-base line-clamp-2'>{title}</li>
          <li className='text-gray-600 text-sm'>{channelTitle}</li>
          <li className='text-gray-600 text-sm'>{formatViewCount(statistics.viewCount)}</li>
        </ul>
      </div>
    </Link>
  );
};

export default VideoCard;
