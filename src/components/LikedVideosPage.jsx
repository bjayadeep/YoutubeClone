import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VideoListDisplay from './VideoListDisplay';
import { closeMenu } from '../utils/appSlice';

const LikedVideosPage = () => {
    const likedVideoIds = useSelector(state => Object.keys(state.likedVideos.videos));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(closeMenu()); 
    }, [dispatch]);

    return (
        <div className="pt-[64px]"> 
            <VideoListDisplay videoIds={likedVideoIds} title="Liked Videos" />
        </div>
    );
};

export default LikedVideosPage;
