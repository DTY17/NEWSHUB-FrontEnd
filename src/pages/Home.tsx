import { useEffect, useState } from "react";
import {
  Search,
  TrendingUp,
  Eye,
  Clock,
  Bookmark,
  ArrowRight,
} from "lucide-react";
import { mostview, popular, recent } from "../services/post";
import { Link } from "react-router-dom";

const genres = [
  "Technology",
  "Business",
  "Sports",
  "Entertainment",
  "Politics",
  "Science",
];

interface Post {
  _id: string;
  image: string[];
  topic: string;
  paragraph: string[];
  genre: string[];
  views: number;
  date: string;
}

interface Props {
  filter: string;
  setFilter: (f: string) => void;
  selectedGenre: string;
  setSelectedGenre: (g: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const HomePage: React.FC<Props> = ({
  filter,
  setFilter,
  selectedGenre,
  setSelectedGenre,
  searchQuery,
  setSearchQuery,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [popularPost, setPopularPost] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      setFilteredPosts(await recent(selectedGenre));
      setPopularPost(await popular(selectedGenre));
    }
    fetchPosts();
  }, [filter, selectedGenre, searchQuery]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        if (filter === "popular") {
          const p = await popular(selectedGenre);
          setFilteredPosts(p);
        } else if (filter === "mostViewed") {
          const p = await mostview(selectedGenre);
          setFilteredPosts(p);
        } else if (filter === "recent") {
          const p = await recent(selectedGenre);
          setFilteredPosts(p);
        }
      } catch (err: any) {
        //code
        console.log(err);
      } finally {
        // code
        setLoading(false);
      }
    }
    fetchPosts();
  }, [filter]);

  return (
    <div className="w-full px-4 py-8 bg-linear-to-br from-slate-50 via-gray-50 to-blue-50 min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center min-h-[500px]">
          <img
            src="https://res.cloudinary.com/dxxn3lxqw/image/upload/v1767445064/tenor_opbpzk.gif"
            alt="Loading..."
            className="h-fit w-fit"
          />
        </div>
      ) : (
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-80 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-4 text-gray-900 uppercase tracking-wider flex items-center">
                  <Search size={20} className="mr-2 text-blue-600" />
                  Search
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchInput}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSearchQuery(searchInput);
                      }
                    }}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-gray-800 placeholder-gray-400 transition-all duration-200"
                  />
                  <Search
                    className="absolute left-3 top-3.5 text-gray-400"
                    size={20}
                  />
                </div>
              </div>

              <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-lg shadow-md p-6 text-white">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-wider flex items-center">
                  <TrendingUp size={20} className="mr-2" />
                  Filter By
                </h3>
                <div className="space-y-3">
                  {["recent", "mostViewed", "popular"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-sm tracking-wide ${
                        filter === f
                          ? "bg-white text-blue-600 shadow-lg transform scale-105"
                          : "bg-white bg-opacity-20 text-black hover:bg-opacity-30 backdrop-blur-sm"
                      }`}
                    >
                      {f === "recent" && (
                        <Clock size={16} className="inline mr-2" />
                      )}
                      {f === "mostViewed" && (
                        <Eye size={16} className="inline mr-2" />
                      )}
                      {f === "popular" && (
                        <TrendingUp size={16} className="inline mr-2" />
                      )}
                      {f === "recent"
                        ? "Latest News"
                        : f === "mostViewed"
                        ? "Most Viewed"
                        : "Trending Now"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-4 text-gray-900 uppercase tracking-wider">
                  Categories
                </h3>
                <div className="space-y-2">
                  {["All", ...genres].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGenre(g)}
                      className={`w-full py-2.5 px-4 rounded-lg text-left transition-all duration-300 text-sm font-medium ${
                        selectedGenre === g
                          ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md transform translate-x-1"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-linear-to-br from-slate-900 via-gray-900 to-slate-800 rounded-lg shadow-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-5 uppercase tracking-wider flex items-center border-b-2 border-blue-500 pb-3">
                  <TrendingUp size={20} className="mr-2 text-blue-400" />
                  Trending Now
                </h3>
                <div className="space-y-4">
                  {popularPost.slice(0, 6).map((p, idx) => (
                    <Link
                      key={p._id}
                      to={`/home/post/${p._id}`}
                      className="flex space-x-3 pb-4 border-b border-gray-700 last:border-0 group"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={p.image[0]}
                          alt={p.topic}
                          className="w-24 h-24 object-cover rounded-lg group-hover:ring-2 group-hover:ring-blue-400 transition-all duration-300"
                        />
                        <span className="absolute -top-2 -left-2 bg-blue-500 text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                          {idx + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-300 transition-colors leading-snug">
                          {p.topic}
                        </h4>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            {p.views.toLocaleString()}
                          </span>
                          <span className="text-gray-600">•</span>
                          <span>
                            {new Date(p.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            <main className="flex-1">
              <div className="mb-8 pb-6 border-b-4 border-blue-600">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  {filter === "recent"
                    ? "Latest News"
                    : filter === "mostViewed"
                    ? "Most Viewed"
                    : "Trending Stories"}
                </h2>
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  {selectedGenre !== "All" && (
                    <>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {selectedGenre}
                      </span>
                      <span>•</span>
                    </>
                  )}
                  <span className="font-medium">
                    {filteredPosts.length} Articles
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPosts.map((p) => (
                  <Link
                    key={p._id}
                    to={`/home/post/${p._id}`}
                    className="group"
                  >
                    <div
                      key={p._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={p.image[0]}
                          alt={p.topic}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                          {p.genre[0]}
                        </div>
                        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60"></div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                          <span className="flex items-center font-medium">
                            <Clock size={14} className="mr-1 text-blue-600" />
                            {new Date(p.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center font-medium">
                            <Eye size={14} className="mr-1 text-blue-600" />
                            {p.views.toLocaleString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                          {p.topic}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                          {p.paragraph[0]}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <button className="text-blue-600 font-bold text-sm flex items-center group/btn hover:text-blue-700 transition-colors">
                            Read More
                            <ArrowRight
                              size={16}
                              className="ml-2 group-hover/btn:translate-x-1 transition-transform"
                            />
                          </button>
                          <button className="text-gray-400 hover:text-blue-600 transition-colors duration-200 p-2 hover:bg-blue-50 rounded-lg">
                            <Bookmark size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* <div className="mt-12 text-center">
                <button className="px-10 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold uppercase tracking-wide rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Load More Articles
                </button>
              </div> */}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};
