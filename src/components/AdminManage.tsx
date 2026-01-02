import React, { useEffect, useState } from "react";
import { deletePost, getPost } from "../services/post";
import { useNavigate } from "react-router-dom";

// Example: replace with your actual API call
const samplePosts = [
  {
    _id: "1",
    title: "First Post",
    views: 1200,
    image: "https://via.placeholder.com/100",
  },
  {
    _id: "2",
    title: "Second Post",
    views: 800,
    image: "https://via.placeholder.com/100",
  },
  {
    _id: "3",
    title: "Third Post",
    views: 500,
    image: "https://via.placeholder.com/100",
  },
];
interface listData {
  _id: string;
  image: string[];
  paragraph: string[];
  topic: string;
  order: string[];
  genre: string[];
  views: number;
  comment: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export const AdminManage: React.FC = () => {
  const [posts, setPosts] = useState(samplePosts);
  const [filteredPosts, setFilteredPosts] = useState<listData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      setPosts(samplePosts)
      const res = await getPost();
      setFilteredPosts(res);
    }
    fetchPosts();
  }, []);

  const handleDelete = (id: string) => {
    // TODO: replace with API call
    // setPosts(posts.filter((p) => p._id !== id));
    deletePost(id,localStorage.getItem("admin_token")as string);
    console.log("Delete");
  };

  const handleEdit = (id: string) => {
    console.log("Responses : ", filteredPosts);
    navigate(`/admin/manage/${id}`);
    //alert(`Edit post ${id}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">Manage Posts</h1>
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts available.</p>
        ) : (
          <ul className="space-y-4">
            {filteredPosts.map((p) => (
              <li
                key={p._id}
                className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.image[0]}
                    alt={p.topic}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-black">
                      {p.topic}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {p.views.toLocaleString()} views
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(p._id)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-3 py-1 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
