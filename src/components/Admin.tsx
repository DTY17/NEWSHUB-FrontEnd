import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { BarChart3, PlusCircle, Files, Settings } from "lucide-react";

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <aside className="bg-white rounded-xl shadow-lg p-6 sticky top-6 h-fit">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">Admin</h2>
            <nav className="space-y-2">
              <NavLink
                to="/admin/analytics"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow"
                      : "bg-linear-to-r from-blue-500 to-purple-500 text-white/90 hover:opacity-90"
                  }`
                }
              >
                <BarChart3 size={18} className="text-white" />
                <span className="ml-2 text-white">Analytics</span>
              </NavLink>
              <NavLink
                to="/admin/add"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow"
                      : "bg-linear-to-r from-blue-500 to-purple-500 text-white/90 hover:opacity-90"
                  }`
                }
              >
                <PlusCircle size={18} className="text-white"/> <span className="ml-2 text-white">Add Post</span>
              </NavLink>
              <NavLink
                to="/admin/manage"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow"
                      : "bg-linear-to-r from-blue-500 to-purple-500 text-white/90 hover:opacity-90"
                  }`
                }
              >
                <Files size={18} className="text-white"/> <span className="ml-2 text-white">Manage Posts</span>
              </NavLink>
              <NavLink
                to="/admin/manage-user"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow"
                      : "bg-linear-to-r from-blue-500 to-purple-500 text-white/90 hover:opacity-90"
                  }`
                }
              >
                <Settings size={18} className="text-white"/> <span className="ml-2 text-white">User Details</span>
              </NavLink>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow"
                      : "bg-linear-to-r from-blue-500 to-purple-500 text-white/90 hover:opacity-90"
                  }`
                }
              >
                <Settings size={18} className="text-white"/> <span className="ml-2 text-white">Settings</span>
              </NavLink>
            </nav>
          </aside>

          <main className="space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
