import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VideoListDisplay from './VideoListDisplay';
import { closeMenu } from '../utils/appSlice';

const WatchLaterPage = () => {
    const watchLaterVideoIds = useSelector(state => Object.keys(state.watchLater.videos));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(closeMenu()); 
    }, [dispatch]);

    return (
        <div className="pt-[64px]"> 
            <VideoListDisplay videoIds={watchLaterVideoIds} title="Watch Later" />
        </div>
    );
};

export default WatchLaterPage;
