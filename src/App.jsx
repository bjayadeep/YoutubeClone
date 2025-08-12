import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Body from "./components/Body";
import Layout from "./components/Layout";
import MainContainer from "./components/MainContainer";
import WatchPage from "./components/WatchPage";
import SearchResultsPage from "./components/SearchResultsPage";
import LikedVideosPage from "./components/LikedVideosPage";     // NEW
import WatchLaterPage from "./components/WatchLaterPage";     // NEW
import HistoryPage from "./components/HistoryPage";           // NEW
import SubscriptionsPage from "./components/SubscriptionsPage"; // NEW
import ChannelPage from "./components/ChannelPage";           // NEW
import store from "./utils/store";
import { Provider } from "react-redux";
import React from "react";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    children: [
      {
        path: "/",
        element: <Body />,
        children: [
          {
            path: "/",
            element: <MainContainer />, 
          },
          {
            path: "watch",
            element: <WatchPage />, 
          },
          {
            path: "results",
            element: <SearchResultsPage />, 
          },
          {
            path: "liked-videos", 
            element: <LikedVideosPage />,
          },
          {
            path: "watch-later", 
            element: <WatchLaterPage />,
          },
          {
            path: "history", 
            element: <HistoryPage />,
          },
          {
            path: "subscriptions", 
            element: <SubscriptionsPage />,
          },
          {
            path: "channel/:channelId",
            element: <ChannelPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  );
}

export default App;
