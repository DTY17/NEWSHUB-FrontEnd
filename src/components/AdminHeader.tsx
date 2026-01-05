import { useEffect } from "react";
import { isTokenValidAdmin } from "../services/auth";
import { useNavigate } from "react-router-dom";

export const AdminHeader = () => {
  const navigation = useNavigate();

  useEffect(() => {
    const admin_email = localStorage.getItem("admin_email");
    const admin_token = localStorage.getItem("admin_token");
    const admin_refresh_token = localStorage.getItem("admin_refresh_token");

    if (!admin_email || !admin_token || !admin_refresh_token) {
      navigation(`/admin/login`);
    }
    async function isValidToken() {
      if (
        !await isTokenValidAdmin(admin_token as string, admin_refresh_token as string)
      ) {
        navigation(`/admin/login`);
      }
    }
    isValidToken()
  });

  return (
    <header className="bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 text-white shadow-lg sticky top-0 z-50">
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-yellow-500 rounded-lg flex items-center justify-center font-bold text-xl">
              N
            </div>
            <span className="text-2xl font-bold">NewsHub</span>
          </div>

          <div className="flex items-center space-x-4"></div>
        </div>
      </div>
    </header>
  );
};
