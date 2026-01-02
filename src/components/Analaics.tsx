// src/admin/AdminAnalytics.tsx
import React, { useEffect, useState } from "react";
import { samplePosts } from "../data/data";
import { getPostCount, getViewCount } from "../services/post";

// const numberFormat = (n: number) => n.toLocaleString();

export const AdminAnalytics: React.FC = () => {
  const totalPosts = samplePosts.length;
  const totalViews = samplePosts.reduce((acc, p) => acc + p.views, 0);
  const avgViews = totalPosts ? Math.round(totalViews / totalPosts) : 0;
  const byGenre = samplePosts.reduce<Record<string, number>>((acc, p) => {
    acc[p.genre] = (acc[p.genre] || 0) + 1;
    return acc;
  }, {});

  const [totalPost, setTotalPost] = useState(0);
  const [totalView, setTotalView] = useState(0);

  useEffect(() => {
    async function getCount() {
      console.log(avgViews);
      setTotalPost(
        await getPostCount(localStorage.getItem("admin_token") as string)
      );
      setTotalView(
        await getViewCount(localStorage.getItem("admin_token") as string)
      );
      console.log(totalView)
    }
    getCount();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-gray-500 font-semibold">Total Posts</h3>
          <p className="text-4xl font-bold text-indigo-900">
            {totalPost}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-gray-500 font-semibold">Total Views</h3>
          <p className="text-4xl font-bold text-indigo-900">
            {totalView}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-gray-500 font-semibold">Average Views</h3>
          <p className="text-4xl font-bold text-indigo-900">
            {Math.ceil(totalView / totalPost)}
          </p>
        </div>
      </div>

      <div className="bg-linear-to-br from-indigo-900 to-purple-900 rounded-xl shadow-lg p-6 text-white mt-8">
        <h3 className="text-xl font-bold mb-4">Posts by Genre</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(byGenre).map(([genre, count]) => (
            <div key={genre} className="bg-white/10 rounded-lg p-4">
              <p className="text-pink-300 text-sm">{genre}</p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
