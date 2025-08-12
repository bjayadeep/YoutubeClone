import React from 'react';
import { Link } from 'react-router-dom';
import { formatViewCount } from '../utils/helpers'; 

const VideoCard = ({ info }) => {
  if (!info || !info.snippet || !info.id) {
    return null;
  }

  const videoId = info.id.videoId || info.id; 

  const { snippet } = info;
  const { channelTitle, title, thumbnails, channelId } = snippet;

  const viewCount = info.statistics ? formatViewCount(info.statistics.viewCount) : null;

  return (

    <div className='p-2 m-0 shadow-md rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200'>

      <Link to={"/watch?v=" + videoId}>
        <img
          className='rounded-lg w-full h-40 object-cover'
          src={thumbnails.medium.url}
          alt="thumbnail"
        />
        <ul className='mt-2'>
          <li className='font-bold text-base line-clamp-2'>{title}</li>
        </ul>
      </Link>

      {channelId && (
        <Link to={`/channel/${channelId}`} className="block text-gray-600 text-sm hover:underline mt-1">
          {channelTitle}
        </Link>
      )}
      {!channelId && <p className='text-gray-600 text-sm mt-1'>{channelTitle}</p>} {/* Fallback if channelId is missing */}

      {viewCount && <p className='text-gray-600 text-sm'>{viewCount}</p>}
    </div>
  );
};

export default VideoCard;
