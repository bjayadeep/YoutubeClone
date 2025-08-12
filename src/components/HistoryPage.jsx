import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VideoListDisplay from './VideoListDisplay';
import { closeMenu } from '../utils/appSlice';

const HistoryPage = () => {
    const historyVideoIds = useSelector(state => state.history.videos); 
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(closeMenu()); 
    }, [dispatch]);

    return (
        <div className="pt-[64px]"> 
            <VideoListDisplay videoIds={historyVideoIds} title="Watch History" />
        </div>
    );
};

export default HistoryPage;
