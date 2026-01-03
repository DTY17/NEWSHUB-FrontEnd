import { useEffect, useState } from "react";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { HomePage } from "../pages/Home";
import { Footer } from "../components/Footer";
import PostPage from "../components/PostContent";
import SearchData from "../pages/Search";
import { AboutPage } from "../pages/About";
import { ContactPage } from "../pages/Contact";
import { AdminLayout } from "../components/Admin";
import { AdminAnalytics } from "../components/Analaics";
import { AdminAddPost } from "../components/AddPost";
import { AdminHeader } from "../components/AdminHeader";
import { Profile } from "../pages/Profile";
import { AdminSettings } from "../components/Settings";
import { AdminManage } from "../components/AdminManage";
import { AdminEditPost } from "../components/EditPost";
import AdminLogin from "../components/AdminLogin";

const Router = () => {
  const [currentPage, setCurrentPage] = useState<"home" | "about" | "contact">(
    "home"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filter, setFilter] = useState("recent");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dp, setDP] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigation = useNavigate();

  useEffect(() => {
    if (searchQuery !== "") {
      navigation("/home/search");
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Routes>
        <Route
          path="/home/*"
          element={
            <>
              <Header
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                setDP={setDP}
                dp={dp}
                showLoginModal={showLoginModal}
                setShowLoginModal={setShowLoginModal}
              />
              <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
                <Outlet />
              </div>
              <Footer />
            </>
          }
        >
          <Route
            index
            element={
              <>
                <HomePage
                  filter={filter}
                  setFilter={setFilter}
                  selectedGenre={selectedGenre}
                  setSelectedGenre={setSelectedGenre}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </>
            }
          />
          <Route
            path="post/:_id"
            element={
              <PostPage
                showLoginModal={showLoginModal}
                setShowLoginModal={setShowLoginModal}
                setIsLoggedIn={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="search"
            element={<SearchData searchData={searchQuery} />}
          />
          <Route path="aboutme" element={<AboutPage />} />
          <Route path="contactme" element={<ContactPage />} />
          <Route
            path="profile/:email"
            element={<Profile setDP={setDP} dp={dp} />}
          />
        </Route>

        <Route
          path="/admin/*"
          element={
            <>
              <AdminHeader />
              <AdminLayout />
              <Footer />
            </>
          }
        >
          <Route index element={<AdminAnalytics />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="add" element={<AdminAddPost />} />
          <Route path="manage" element={<AdminManage />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="manage/:id" element={<AdminEditPost />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </div>
  );
};

export default Router;
