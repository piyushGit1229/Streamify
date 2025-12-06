import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import WatchPartyLayout from "../layouts/WatchPartyLayout";
import HomePage from "../pages/Home/HomePage";
import ExplorePage from "../pages/ExplorePage";
import TrendingPage from "../pages/TrendingPage";
import LibraryPage from "../pages/LibraryPage";
import WatchPage from "../pages/watch/WatchPage";
import WatchPartyPage from "../pages/WatchParty/WatchPartyPage";
import JoinWatchParty from "../pages/WatchParty/JoinWatchParty";
import UploadPage from "../pages/UploadPage";
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "explore", element: <ExplorePage /> },
      { path: "trending", element: <TrendingPage /> },
      { path: "library", element: <LibraryPage /> },
      { path: "upload", element: <UploadPage /> },
      { path: "watch/:videoId", element: <WatchPage /> },
    ],
  },
  {
    path: "/watchparty",
    element: <WatchPartyLayout />,
    children: [
      { path: ":roomCode", element: <WatchPartyPage /> },
      { path: ":roomCode/join", element: <JoinWatchParty /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);
