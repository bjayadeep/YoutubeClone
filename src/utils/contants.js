
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const YOUTUBE_VIDEOS_API =
  `/api/videos&key=${API_KEY}&maxResults=10`;

export const YOUTUBE_SEARCH_API =
  `/api/youtube-search&key=${API_KEY}&maxResults=10`;

export const YOUTUBE_VIDEO_DETAILS_API =
  `/api/video-details&key=${API_KEY}&id=`;
