import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Body from "./components/Body"; 
import MainContainer from "./components/MainContainer"; 
import WatchPage from "./components/WatchPage"; 
import store from "./utils/store"; 
import { Provider } from "react-redux";
import Layout from "./components/Layout"; 

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
