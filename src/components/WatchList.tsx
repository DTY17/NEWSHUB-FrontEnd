import { useState, useEffect } from "react";
import { Bookmark, Trash2, ExternalLink, Clock, Tag } from "lucide-react";
import { deleteLoadWatchlist, getLoadWatchlist } from "../services/post";
import { Link } from "react-router-dom";

type WatchlistItem = {
  _id: string;
  image: string[];
  paragraph: string[] | string;
  topic: string;
  order?: string[];
  genre: string;
  views: number;
  comment?: string[];
  date: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  isWatchList?: boolean;
};

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [filter, setFilter] = useState<string>("All");

  // derive categories safely
  const categories = [
    "All",
    ...Array.from(new Set(watchlist.map((item) => item.genre))),
  ];

  async function getWatchList() {
    const data = await getLoadWatchlist(
      localStorage.getItem("token") as string,
      localStorage.getItem("email") as string
    );
    setWatchlist(data);
  }

  useEffect(() => {
    getWatchList();
  }, []);

  const filteredWatchlist =
    filter === "All"
      ? watchlist
      : watchlist.filter((item) => item.genre === filter);

  const handleRemove = (id: string) => {
    deleteWatchlist(id);
    getWatchList();
  };


  const deleteWatchlist = async (post: string) => {
    await deleteLoadWatchlist(
      localStorage.getItem("token") as string,
      post,
      localStorage.getItem("email") as string
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown date";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 p-6 text-white">
            <div className="flex items-center gap-3">
              <Bookmark size={28} />
              <div>
                <h1 className="text-2xl font-bold">Your Watchlist</h1>
                <p className="text-sm text-indigo-100 mt-1">
                  {watchlist.length} saved{" "}
                  {watchlist.length === 1 ? "article" : "articles"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Category filter buttons */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                    filter === cat
                      ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredWatchlist.length === 0 ? (
              <div className="text-center py-16">
                <Bookmark className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No saved articles
                </h3>
                <p className="text-gray-500">
                  Start building your watchlist by saving articles you want to
                  read later.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWatchlist.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border rounded-xl p-4 hover:shadow-lg transition group"
                  >
                    <div className="flex gap-4">
                      {item.image && item.image.length > 0 && (
                        <img
                          src={item.image[0]}
                          alt={item.topic}
                          className="w-32 h-32 rounded-lg object-cover shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition">
                            {item.topic}
                          </h3>
                          <button
                            onClick={() => handleRemove(item._id)}
                            className="shrink-0 text-gray-400 hover:text-red-500 transition p-1"
                            title="Remove from watchlist"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {Array.isArray(item.paragraph)
                            ? item.paragraph[0]
                            : item.paragraph}
                        </p>

                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Tag size={14} />
                              {item.genre}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <Clock size={14} />
                              {item.createdAt
                                ? formatDate(item.createdAt)
                                : "Unknown date"}
                            </span>
                          </div>

                          <Link
                            to={`/home/post/${item._id}`}
                            target="_blank"
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                          >
                            Read article
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// import { useState, useEffect } from "react";
// import { Bookmark, Trash2, ExternalLink, Clock, Tag } from "lucide-react";
// import { deleteLoadWatchlist, getLoadWatchlist } from "../services/post";
// import { Link } from "react-router-dom";
// // import { useSelector } from "react-redux";

// type WatchlistItem = {
//   _id: string;
//   image: string[];
//   paragraph: string[] | string;
//   topic: string;
//   order?: string[];
//   genre: string;
//   views: number;
//   comment?: string[];
//   date: string;
//   createdAt?: string;
//   updatedAt?: string;
//   __v?: number;
//   isWatchList?: boolean;
// };

// export default function Watchlist() {
//   const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
//   const [filter, setFilter] = useState<string>("All");

//   // Redux theme mode: "light" | "dark"
//   // const mode = useSelector((state: any) => state.theme?.mode);
//   const mode = "dark"

//   // derive categories safely
//   const categories = [
//     "All",
//     ...Array.from(new Set(watchlist.map((item) => item.genre))),
//   ];

//   async function getWatchList() {
//     const data = await getLoadWatchlist(
//       localStorage.getItem("token") as string,
//       localStorage.getItem("email") as string
//     );
//     setWatchlist(data);
//   }

//   useEffect(() => {
//     getWatchList();
//   }, [watchlist]);

//   const filteredWatchlist =
//     filter === "All"
//       ? watchlist
//       : watchlist.filter((item) => item.genre === filter);

//   const handleRemove = (id: string) => {
//     deleteWatchlist(id);
//     getWatchList();
//   };

//   const deleteWatchlist = async (post: string) => {
//     await deleteLoadWatchlist(
//       localStorage.getItem("token") as string,
//       post,
//       localStorage.getItem("email") as string
//     );
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return "Unknown date";
//     const now = new Date();
//     const diff = now.getTime() - date.getTime();
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));

//     if (days === 0) return "Today";
//     if (days === 1) return "Yesterday";
//     if (days < 7) return `${days} days ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className={mode === "dark" ? "dark" : ""}>
//       <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
//         <div className="max-w-6xl mx-auto px-4 py-8">
//           <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
//             <div className="bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 p-6 text-white">
//               <div className="flex items-center gap-3">
//                 <Bookmark size={28} />
//                 <div>
//                   <h1 className="text-2xl font-bold">Your Watchlist</h1>
//                   <p className="text-sm text-indigo-100 mt-1">
//                     {watchlist.length} saved{" "}
//                     {watchlist.length === 1 ? "article" : "articles"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6">
//               {/* Category filter buttons */}
//               <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
//                 {categories.map((cat) => (
//                   <button
//                     key={cat}
//                     onClick={() => setFilter(cat)}
//                     className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
//                       filter === cat
//                         ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-md"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
//                     }`}
//                   >
//                     {cat}
//                   </button>
//                 ))}
//               </div>

//               {filteredWatchlist.length === 0 ? (
//                 <div className="text-center py-16">
//                   <Bookmark className="mx-auto text-gray-300 mb-4 dark:text-gray-600" size={64} />
//                   <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-200 mb-2">
//                     No saved articles
//                   </h3>
//                   <p className="text-gray-500 dark:text-gray-400">
//                     Start building your watchlist by saving articles you want to
//                     read later.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {filteredWatchlist.map((item) => (
//                     <div
//                       key={item._id}
//                       className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition group"
//                     >
//                       <div className="flex gap-4">
//                         {item.image && item.image.length > 0 && (
//                           <img
//                             src={item.image[0]}
//                             alt={item.topic}
//                             className="w-32 h-32 rounded-lg object-cover shrink-0"
//                           />
//                         )}

//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start justify-between gap-2 mb-2">
//                             <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-indigo-600 transition">
//                               {item.topic}
//                             </h3>
//                             <button
//                               onClick={() => handleRemove(item._id)}
//                               className="shrink-0 text-gray-400 hover:text-red-500 transition p-1"
//                               title="Remove from watchlist"
//                             >
//                               <Trash2 size={18} />
//                             </button>
//                           </div>

//                           <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
//                             {Array.isArray(item.paragraph)
//                               ? item.paragraph[0]
//                               : item.paragraph}
//                           </p>

//                           <div className="flex items-center justify-between flex-wrap gap-2">
//                             <div className="flex items-center gap-3 text-sm">
//                               <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
//                                 <Tag size={14} />
//                                 {item.genre}
//                               </span>
//                               <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
//                                 <Clock size={14} />
//                                 {item.createdAt
//                                   ? formatDate(item.createdAt)
//                                   : "Unknown date"}
//                               </span>
//                             </div>

//                             <Link
//                               to={`/home/post/${item._id}`}
//                               target="_blank"
//                               className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm dark:text-indigo-300 dark:hover:text-indigo-200"
//                             >
//                               Read article
//                               <ExternalLink size={14} />
//                             </Link>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
