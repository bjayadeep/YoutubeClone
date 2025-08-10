export const YOUTUBE_VIDEOS_API =
  "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=30&regionCode=IN&key=" +
  import.meta.env.VITE_GOOGLE_API_KEY;

export const YOUTUBE_SEARCH_API =
  "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&key=" +
  import.meta.env.VITE_GOOGLE_API_KEY +
  "&q=";

export const YOUTUBE_VIDEO_DETAILS_API =
  "https://youtube.googleapis.com/youtube/v3/videos?part=snippet,statistics&key=" +
  import.meta.env.VITE_GOOGLE_API_KEY +
  "&id=";
