import { useEffect, useState } from "react";
import {
  Eye,
  Calendar,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowLeft,
} from "lucide-react";
import { getCommetByAllIDS, getPostID, setComment } from "../services/post";
import { useParams } from "react-router-dom";

interface Comment {
  createdAt: string | number | Date;
  date: string | number | Date;
  _id: string;
  user: IUser;
  comment: string;
}

interface Post {
  id: number;
  topic: string;
  genre: string;
  views: number;
  date: string;
  paragraph?: string | string[];
  image?: string | string[];
  order?: string[];
  comment: Comment[];
}

export interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  image?: string;
  comment: IComment[];
}

export interface IComment {
  _id: string;
  user: IUser;
  comment: string;
  createdAt: string;
}

const PostPage = () => {
  const { _id } = useParams();
  const [posts, setPosts] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComments] = useState<[Comment] | null>(null);
  const [comment_data, setComment_data] = useState<string>("");
  const [reload, setReload] = useState(false);
  const [allowComment, setAllowComment] = useState(false);

  const sendComment = () => {
    setComment(
      _id as string,
      localStorage.getItem("email") as string,
      comment_data,
      localStorage.getItem("token") as string
    );
    setReload(true);
  };

  useEffect(() => {
    async function fetchPost() {
      const result = await getPostID(
        _id as string,
        localStorage.getItem("token") as string
      );
      if (allowComment) {
        const resut_data = await getCommetByAllIDS(
          localStorage.getItem("token") as string,
          result?.comment
        );
        console.log("Comemnts :: ", resut_data);
        setComments(resut_data);
      }

      if (!result) {
        setLoading(true);
      }
      setPosts(result);
      console.log("Result :: ", result);
    }

    fetchPost();
    if (localStorage.getItem("token")) setAllowComment(true);
    else setAllowComment(false);
    if (reload) setReload(false);
  }, [_id, reload]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!posts) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-12 text-center border-l-4 border-red-500">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Post Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The post you are looking for doesn't exist or has been removed.
          </p>
          <button className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  let excerptIndex = 0;
  let imageIndex = 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-blue-50">
      <div className="max-w-9/12 mx-auto px-4 py-8">
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-6 font-medium">
          <ArrowLeft size={20} />
          Back to Articles
        </button>

        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8 pb-6 border-b border-gray-200">
            <h1 className="text-6xl text-black mb-4">{posts.topic}</h1>
            <div className="flex items-center justify-between mb-4">
              <span className="px-4 py-1.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full uppercase tracking-wide shadow-sm">
                {posts.genre}
              </span>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-gray-600 hover:text-blue-600">
                  <Bookmark size={20} />
                </button>
                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-gray-600 hover:text-blue-600">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar size={16} className="text-blue-600" />
                {new Date(posts.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-1.5">
                <Eye size={16} className="text-blue-600" />
                {(posts.views ?? 0).toLocaleString()} views
              </span>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-1.5">
                <MessageCircle size={16} className="text-blue-600" />
                {comment?.length} comments
              </span>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {posts.order?.map((block, i) => {
              switch (block) {
                case "Topic":
                  return (
                    <h1
                      key={i}
                      className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
                    >
                      {posts.topic}
                    </h1>
                  );
                case "Paragraph":
                  if (
                    Array.isArray(posts.paragraph) &&
                    excerptIndex < posts.paragraph.length
                  ) {
                    const text = posts.paragraph[excerptIndex++];
                    return (
                      <p
                        key={i}
                        className="text-gray-700 leading-relaxed text-lg"
                      >
                        {text}
                      </p>
                    );
                  }
                  return null;
                case "Image":
                  if (
                    Array.isArray(posts.image) &&
                    imageIndex < posts.image.length
                  ) {
                    const src = posts.image[imageIndex++];
                    return (
                      <div key={i} className="my-8">
                        <img
                          src={src}
                          alt={`Post image ${i}`}
                          className="w-full rounded-lg shadow-lg"
                        />
                      </div>
                    );
                  }
                  return null;
                default:
                  return null;
              }
            })}
          </div>

          <div className="p-8 pt-6 border-t border-gray-200 bg-linear-to-b from-white to-gray-50">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle size={24} className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Comments ({comment?.length || "Sign up First"})
              </h2>
            </div>
            {/* dd */}
            {allowComment && (
              <>
                <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <textarea
                    placeholder="Share your thoughts..."
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                    rows={3}
                    value={comment_data}
                    onChange={(e) => setComment_data(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end mt-3">
                    <button
                      className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                      onClick={sendComment}
                    >
                      Post Comment
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {comment?.map((c, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                            <img
                              src={c.user.image}
                              alt="icon"
                              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 block">
                              {c.user.firstname}
                            </span>
                            <span className="text-gray-500 text-xs flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(c.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {c.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {/* dd */}
          </div>
        </article>
      </div>
    </div>
  );
};
export default PostPage;
