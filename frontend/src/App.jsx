import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/Home/HomePage";
import WatchPage from "./pages/watch/WatchPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import UploadPage from "./pages/UploadPage";
import TrendingPage from "./pages/TrendingPage";
import ExplorePage from "./pages/ExplorePage";
import LikedVideosPage from "./pages/Library/LikedPage";
import PlaylistDetailPage from "./pages/Library/PlaylistDetailPage";
import MyPlaylistsPage from "./pages/Library/PlaylistsPage";
import MysubscriptionsPage from "./pages/Library/SubscriptionsPage";
import ChannelPage from "./pages/Library/ChannelPage";
import ProfilePage from "./components/profile/ProfilePage";
import MyCutsPage from "./pages/Library/MyCutsPage";

export default function App() {
  return (
    <Routes>

      {/* Auth pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/upload" element={<UploadPage />} />

      {/* Home */}
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />

      {/* Watch Page */}
      <Route
        path="/watch/:id"
        element={
          <MainLayout>
            <WatchPage />
          </MainLayout>
        }
      />

      {/* Trending */}
      <Route
        path="/trending"
        element={
          <MainLayout>
            <TrendingPage />
          </MainLayout>
        }
      />

      {/* Explore (THIS NEEDS TO BE OUTSIDE) */}
      <Route
        path="/explore"
        element={
          <MainLayout>
            <ExplorePage />
          </MainLayout>
        }
      />

       <Route
          path="/liked"
          element={
            <MainLayout>
              <LikedVideosPage />
            </MainLayout>
          }
       />

       <Route
  path="/playlists"
  element={
    <MainLayout>
      <MyPlaylistsPage />
    </MainLayout>
  }
/>

<Route
  path="/playlist/:id"
  element={
    <MainLayout>
      <PlaylistDetailPage />
    </MainLayout>
  }
/>


                        
<Route
  path="/subscriptions"
  element={
    <MainLayout>
      <MysubscriptionsPage/>
    </MainLayout>
  }
/>

<Route
  path="/channel/:channelId"
  element={
    <MainLayout>
      <ChannelPage />
    </MainLayout>
  }
/>


<Route
  path="/profile"
  element={
    <MainLayout>
      <ProfilePage />
    </MainLayout>
  }
/>

<Route
  path="/mycuts"
  element={
    <MainLayout>
      <MyCutsPage />
    </MainLayout>
  }
/>







    </Routes>
  );
}
