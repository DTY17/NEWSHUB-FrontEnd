import { Outlet } from "react-router-dom";

export const UserPanel = () => {
  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
          <Outlet/>
      </div>
    </>
  );
};
