import React from 'react';
import { useSelector } from 'react-redux';

const Sidebar = () => {
    const isMenuOpen = useSelector(store=>store.app.isMenuOpen);

    if(!isMenuOpen) return null;
    
  return (
    <div className='p-4 m-2 w-56 shadow-lg rounded-lg bg-white'>
      <ul className='mb-4'>
        <li className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer font-bold'>Home</li>
        <li className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer'>Shorts</li>
        <li className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer'>Videos</li>
        <li className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer'>Live</li>
      </ul>
      
      <hr className='my-2 border-gray-200' />
      
      <h1 className='font-bold text-lg px-4 mb-2'>Subscriptions</h1>
      <ul className='mb-4'>
        <li className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer'>Music</li>
        <li className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer'>Sports</li>
        <li className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer'>Gaming</li>
        <li className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer'>Movies</li>
      </ul>

      <hr className='my-2 border-gray-200' />

      <h1 className='font-bold text-lg px-4 mb-2'>You</h1>
      <ul>
        <li className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer'>History</li>
        <li className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer'>Playlists</li>
        <li className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer'>Liked videos</li>
        <li className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer'>Watch later</li>
      </ul>
    </div>
  );
};

export default Sidebar;