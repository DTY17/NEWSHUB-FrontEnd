import { useEffect, useState } from "react";
import {
  Eye,
  Calendar,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowLeft,
  LogIn,
  ReceiptText
} from "lucide-react";
import { getCommetByAllIDS, getPostID, setComment } from "../services/post";
import { useParams, useNavigate } from "react-router-dom";
import getAiResponse from "../services/ai";

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

interface Props {
  showLoginModal: boolean;
  setShowLoginModal: (p: boolean) => void;
  setIsLoggedIn: (p: boolean) => void;
  isLoggedIn: boolean;
}

const PostPage = ({ setShowLoginModal , setIsLoggedIn , isLoggedIn }: Props) => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [commentData, setCommentData] = useState<string>("");
  const [reload, setReload] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [ai , setAi] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSendComment = async () => {
    if (!commentData.trim()) return;

    try {
      setCommentLoading(true);
      await setComment(
        _id as string,
        localStorage.getItem("email") as string,
        commentData.trim(),
        localStorage.getItem("token") as string
      );
      setCommentData("");
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(true);
  };

  const loadComment = async (result: any) => {
    try {
      if (!isLoggedIn) return;
      const commentsData = await getCommetByAllIDS(
        localStorage.getItem("token") as string,
        result.comment
      );
      setComments(commentsData || []);
    } catch (commentError) {
      console.error("Failed to fetch comments:", commentError);
      setComments([]);
    }
  };

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const result = await getPostID(
          _id as string,
          localStorage.getItem("token") as string
        );

        const data = Array.isArray(result.paragraph)
          ? result.paragraph.join("")
          : String(result.paragraph ?? "");

        const res = await getAiResponse(data);
        if (res === "error-429") setAi("tokens empty")
        else setAi(res as string)

        if (result?.comment && result.comment.length > 0) {
          loadComment(result)
        } else {
          setComments([]);
        }

        setPosts(result);
      } catch (err: any) {
        console.error("Failed to fetch post:", err);
        setPosts(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [_id, reload,isLoggedIn]);

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
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
          >
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
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-6 font-medium"
        >
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
                {comments?.length || 0} comments
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

          <div className="mt-20 p-8 pt-6 border-t border-gray-200  bg-linear-to-b from-white to-gray-50 ">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                   <ReceiptText size={24} className="text-blue-600" />
                   <h2 className="text-2xl font-bold text-gray-900 ">
                     Ai Generated Summery
                   </h2>
                 </div>
               </div>
               <div className="bg-white  p-6 rounded-lg shadow-sm border text-black border-gray-100  hover:border-blue-200  transition-all duration-200">
                 <p>{ai}</p>
               </div>
             </div>

          <div className="p-8 pt-6 border-t border-gray-200 bg-linear-to-b from-white to-gray-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MessageCircle size={24} className="text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Comments ({comments?.length || 0})
                </h2>
              </div>
              {!isLoggedIn && (
                <button
                  onClick={handleLoginRedirect}
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <LogIn size={18} />
                  Sign in to comment
                </button>
              )}
            </div>

            {/* Comment Input Section */}
            {isLoggedIn ? (
              <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <textarea
                  placeholder="Share your thoughts..."
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                  rows={3}
                  value={commentData}
                  onChange={(e) => setCommentData(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      e.preventDefault();
                      handleSendComment();
                    }
                  }}
                ></textarea>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm text-gray-500">
                    Press Ctrl+Enter to post
                  </p>
                  <button
                    className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSendComment}
                    disabled={!commentData.trim() || commentLoading}
                  >
                    {commentLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Posting...
                      </span>
                    ) : (
                      "Post Comment"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-8 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Join the conversation
                </h3>
                <p className="text-gray-600 mb-4">
                  Sign in to share your thoughts on this article
                </p>
                <button
                  onClick={handleLoginRedirect}
                  className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                >
                  <LogIn size={20} />
                  Sign in to comment
                </button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden shadow-md">
                          {comment.user?.image ? (
                            <img
                              src={comment.user.image}
                              alt={comment.user.firstname}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                              {comment.user?.firstname?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 block">
                            {comment.user?.firstname || "Anonymous"}
                          </span>
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(comment.createdAt).toLocaleDateString(
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
                      {comment.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <MessageCircle
                    size={48}
                    className="text-gray-300 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No comments yet
                  </h3>
                  <p className="text-gray-500">
                    {isLoggedIn
                      ? "Be the first to share your thoughts!"
                      : "Sign in to be the first to comment!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostPage;

// import { useEffect, useState } from "react";
// import {
//   Eye,
//   Calendar,
//   MessageCircle,
//   Share2,
//   Bookmark,
//   ArrowLeft,
//   LogIn,
//   ReceiptText,
// } from "lucide-react";
// import { getCommetByAllIDS, getPostID, setComment } from "../services/post";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import getAiResponse from "../services/ai";

// interface Comment {
//   createdAt: string | number | Date;
//   date: string | number | Date;
//   _id: string;
//   user: IUser;
//   comment: string;
// }

// interface Post {
//   id: number;
//   topic: string;
//   genre: string;
//   views: number;
//   date: string;
//   paragraph?: string | string[];
//   image?: string | string[];
//   order?: string[];
//   comment: Comment[];
// }

// export interface IUser {
//   _id: string;
//   firstname: string;
//   lastname: string;
//   email: string;
//   image?: string;
//   comment: IComment[];
// }

// export interface IComment {
//   _id: string;
//   user: IUser;
//   comment: string;
//   createdAt: string;
// }

// interface Props {
//   showLoginModal: boolean;
//   setShowLoginModal: (p: boolean) => void;
//   setIsLoggedIn: (p: boolean) => void;
//   isLoggedIn: boolean;
// }

// const PostPage = ({ setShowLoginModal, setIsLoggedIn, isLoggedIn }: Props) => {
//   const { _id } = useParams();
//   const navigate = useNavigate();
//   const [posts, setPosts] = useState<Post | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [comments, setComments] = useState<Comment[] | null>(null);
//   const [commentData, setCommentData] = useState<string>("");
//   const [reload, setReload] = useState(false);
//   const [commentLoading, setCommentLoading] = useState(false);
//   const [ai , setAi] = useState("");

//   // Redux theme mode: "light" | "dark"
//   const mode = useSelector((state: any) => state.theme.mode);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, []);

//   const handleSendComment = async () => {
//     if (!commentData.trim()) return;

//     try {
//       setCommentLoading(true);
//       await setComment(
//         _id as string,
//         localStorage.getItem("email") as string,
//         commentData.trim(),
//         localStorage.getItem("token") as string
//       );
//       setCommentData("");
//       setReload((prev) => !prev);
//     } catch (error) {
//       console.error("Failed to post comment:", error);
//     } finally {
//       setCommentLoading(false);
//     }
//   };

//   const handleLoginRedirect = () => {
//     setShowLoginModal(true);
//   };

//   const loadComment = async (result: any) => {
//     try {
//       if (!isLoggedIn) return;
//       const commentsData = await getCommetByAllIDS(
//         localStorage.getItem("token") as string,
//         result.comment
//       );
//       setComments(commentsData || []);
//     } catch (commentError) {
//       console.error("Failed to fetch comments:", commentError);
//       setComments([]);
//     }
//   };

//   useEffect(() => {
//     async function fetchPost() {
//       try {
//         setLoading(true);
//         const result = await getPostID(
//           _id as string,
//           localStorage.getItem("token") as string
//         );

//         const data = Array.isArray(result.paragraph)
//           ? result.paragraph.join("")
//           : String(result.paragraph ?? "");
//         console.log("result:", data);

//         const res = await getAiResponse(data);
//         setAi(res as string)

//         // Fetch comments if post has comments
//         if (result?.comment && result.comment.length > 0) {
//           const res = await loadComment(result);
//           console.log(res);
//         } else {
//           setComments([]);
//         }

//         setPosts(result);
//       } catch (err: any) {
//         console.error("Failed to fetch post:", err);
//         setPosts(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchPost();
//   }, [_id, reload, isLoggedIn]);

//   if (loading) {
//     return (
//       <div
//         className={
//           mode === "dark"
//             ? "min-h-screen bg-linear-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center"
//             : "min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center"
//         }
//       >
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center border border-gray-100 dark:border-gray-700">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-300 font-medium">
//             Loading article...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!posts) {
//     return (
//       <div
//         className={
//           mode === "dark"
//             ? "min-h-screen bg-linear-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center"
//             : "min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center"
//         }
//       >
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center border-l-4 border-red-500 dark:border-red-600">
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
//             Post Not Found
//           </h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-6">
//             The post you are looking for doesn't exist or has been removed.
//           </p>
//           <button
//             onClick={() => navigate("/")}
//             className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   let excerptIndex = 0;
//   let imageIndex = 0;

//   return (
//     <div className={mode === "dark" ? "dark" : ""}>
//       <div
//         className={
//           mode === "dark"
//             ? "min-h-screen bg-linear-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700"
//             : "min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-blue-50"
//         }
//       >
//         <div className="max-w-9/12 mx-auto px-4 py-8">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 mb-6 font-medium"
//           >
//             <ArrowLeft size={20} />
//             Back to Articles
//           </button>

//           <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
//             <div className="p-8 pb-6 border-b border-gray-200 dark:border-gray-700">
//               <h1 className="text-4xl md:text-6xl text-black dark:text-gray-100 mb-4">
//                 {posts.topic}
//               </h1>
//               <div className="flex items-center justify-between mb-4">
//                 <span className="px-4 py-1.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full uppercase tracking-wide shadow-sm">
//                   {posts.genre}
//                 </span>
//                 <div className="flex items-center gap-4">
//                   <button className="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:text-blue-600">
//                     <Bookmark size={20} />
//                   </button>
//                   <button className="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:text-blue-600">
//                     <Share2 size={20} />
//                   </button>
//                 </div>
//               </div>

//               <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
//                 <span className="flex items-center gap-1.5">
//                   <Calendar size={16} className="text-blue-600" />
//                   {new Date(posts.date).toLocaleDateString("en-US", {
//                     month: "long",
//                     day: "numeric",
//                     year: "numeric",
//                   })}
//                 </span>
//                 <span className="text-gray-400 dark:text-gray-500">•</span>
//                 <span className="flex items-center gap-1.5">
//                   <Eye size={16} className="text-blue-600" />
//                   {(posts.views ?? 0).toLocaleString()} views
//                 </span>
//                 <span className="text-gray-400 dark:text-gray-500">•</span>
//                 <span className="flex items-center gap-1.5">
//                   <MessageCircle size={16} className="text-blue-600" />
//                   {comments?.length || 0} comments
//                 </span>
//               </div>
//             </div>

//             {/* Content */}
//             <div className="p-8 space-y-6">
//               {/* Render content according to posts.order (Topic, Paragraph, Image) */}
//               {posts.order?.map((block, i) => {
//                 switch (block) {
//                   case "Topic":
//                     return (
//                       <h1
//                         key={i}
//                         className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight"
//                       >
//                         {posts.topic}
//                       </h1>
//                     );
//                   case "Paragraph":
//                     if (
//                       Array.isArray(posts.paragraph) &&
//                       excerptIndex < posts.paragraph.length
//                     ) {
//                       const text = posts.paragraph[excerptIndex++];
//                       return (
//                         <p
//                           key={i}
//                           className="text-gray-700 dark:text-gray-200 leading-relaxed text-lg"
//                         >
//                           {text}
//                         </p>
//                       );
//                     }
//                     return null;
//                   case "Image":
//                     if (
//                       Array.isArray(posts.image) &&
//                       imageIndex < posts.image.length
//                     ) {
//                       const src = posts.image[imageIndex++];
//                       return (
//                         <div key={i} className="my-8">
//                           <img
//                             src={src}
//                             alt={`Post image ${i}`}
//                             className="w-full rounded-lg shadow-lg"
//                           />
//                         </div>
//                       );
//                     }
//                     return null;
//                   default:
//                     return null;
//                 }
//               })}
//             </div>
//             <div className="p-8 pt-6 border-t border-gray-200 dark:border-gray-700 bg-linear-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-800">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center gap-3">
//                   <ReceiptText size={24} className="text-blue-600" />
//                   <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                     Ai Generated Summery
//                   </h2>
//                 </div>
//               </div>
//               <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-gray-600 transition-all duration-200">
//                 <p>{ai}</p>
//               </div>
//             </div>

//             <div className="p-8 pt-6 border-t border-gray-200 dark:border-gray-700 bg-linear-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-800">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center gap-3">
//                   <MessageCircle size={24} className="text-blue-600" />
//                   <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                     Comments ({comments?.length || 0})
//                   </h2>
//                 </div>
//                 {!isLoggedIn && (
//                   <button
//                     onClick={handleLoginRedirect}
//                     className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold dark:bg-gray-900 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
//                   >
//                     <LogIn size={18} />
//                     Sign in to comment
//                   </button>
//                 )}
//               </div>

//               {/* Comment Input Section */}
//               {isLoggedIn ? (
//                 <div className="mb-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
//                   <textarea
//                     placeholder="Share your thoughts..."
//                     className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-gray-100 resize-none text-gray-800 placeholder-gray-400 transition-all duration-200"
//                     rows={3}
//                     value={commentData}
//                     onChange={(e) => setCommentData(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" && e.ctrlKey) {
//                         e.preventDefault();
//                         handleSendComment();
//                       }
//                     }}
//                   ></textarea>
//                   <div className="flex justify-between items-center mt-3">
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Press Ctrl+Enter to post
//                     </p>
//                     <button
//                       className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                       onClick={handleSendComment}
//                       disabled={!commentData.trim() || commentLoading}
//                     >
//                       {commentLoading ? (
//                         <span className="flex items-center gap-2">
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           Posting...
//                         </span>
//                       ) : (
//                         "Post Comment"
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className=" mb-8 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 text-center dark:from-gray-900 dark:to-gray-800 dark:border-gray-700 dark:bg-linear-to-r ">
//                   {" "}
//                   <div className="w-16 h-16 bg-blue-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <MessageCircle
//                       size={32}
//                       className="text-blue-600 dark:text-blue-400"
//                     />
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
//                     Join the conversation
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-300 mb-4">
//                     Sign in to share your thoughts on this article
//                   </p>
//                   <button
//                     onClick={handleLoginRedirect}
//                     className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
//                   >
//                     <LogIn size={20} />
//                     Sign in to comment
//                   </button>
//                 </div>
//               )}

//               {/* Comments List */}
//               <div className="space-y-4">
//                 {comments && comments.length > 0 ? (
//                   comments.map((comment) => (
//                     <div
//                       key={comment._id}
//                       className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-gray-600 transition-all duration-200"
//                     >
//                       <div className="flex justify-between items-start mb-3">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-full overflow-hidden shadow-md">
//                             {comment.user?.image ? (
//                               <img
//                                 src={comment.user.image}
//                                 alt={comment.user.firstname}
//                                 className="w-full h-full object-cover"
//                               />
//                             ) : (
//                               <div className="w-full h-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
//                                 {comment.user?.firstname?.charAt(0) || "U"}
//                               </div>
//                             )}
//                           </div>
//                           <div>
//                             <span className="font-semibold text-gray-900 dark:text-gray-100 block">
//                               {comment.user?.firstname || "Anonymous"}
//                             </span>
//                             <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
//                               <Calendar size={12} />
//                               {new Date(comment.createdAt).toLocaleDateString(
//                                 "en-US",
//                                 {
//                                   month: "short",
//                                   day: "numeric",
//                                   year: "numeric",
//                                 }
//                               )}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
//                         {comment.comment}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
//                     <MessageCircle
//                       size={48}
//                       className="text-gray-300 dark:text-gray-500 mx-auto mb-4"
//                     />
//                     <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
//                       No comments yet
//                     </h3>
//                     <p className="text-gray-500 dark:text-gray-400">
//                       {isLoggedIn
//                         ? "Be the first to share your thoughts!"
//                         : "Sign in to be the first to comment!"}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </article>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostPage;
