import { useCallback } from "react";
import {
  ArrowRight,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

type Post = {
  _id: string;
  image: string[];
  paragraph: string[] | string;
  topic: string;
  order?: string[];
  genre: string | string[];
  views: number;
  comment?: string[];
  date: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

type SearchPostsPageProps = {
  loading: boolean;
  posts: Post[];
  searchPageQuery: string;
  setSearchPageQuery: React.Dispatch<React.SetStateAction<string>>;
  searchPageGenre: string;
  setSearchPageGenre: React.Dispatch<React.SetStateAction<string>>;
  currentSearchPage: number;
  setCurrentSearchPage: React.Dispatch<React.SetStateAction<number>>;
  postsPerPage: number;
  searchDataFun: (inp: string) => Promise<void>;
  genres: string[];
};

const SearchPostsPage: React.FC<SearchPostsPageProps> = ({
  loading,
  posts,
  searchPageQuery,
  setSearchPageQuery,
  searchPageGenre,
  setSearchPageGenre,
  currentSearchPage,
  setCurrentSearchPage,
  postsPerPage,
  searchDataFun,
  genres,
}) => {
  const filterSearchPosts = useCallback(() => {
    if (!Array.isArray(posts)) return [];

    const byGenre =
      searchPageGenre === "All"
        ? posts
        : posts.filter((p) => {
            if (Array.isArray(p.genre)) {
              return p.genre.includes(searchPageGenre);
            }
            return String(p.genre) === searchPageGenre;
          });

    return byGenre;
  }, [posts, searchPageGenre]);

  const filteredPosts = filterSearchPosts();
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / postsPerPage)
  );
  const startIndex = (currentSearchPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <div className="w-full px-4 py-8 bg-linear-to-br from-slate-50 via-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 border-l-4 border-blue-600">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Search size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Search Posts</h1>
              <p className="text-gray-600 text-sm">
                Find articles by keyword or category
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm uppercase tracking-wide">
                Search by keyword
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter keywords..."
                  value={searchPageQuery}
                  onChange={(e) => {
                    setSearchPageQuery(e.target.value);
                    setCurrentSearchPage(1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void searchDataFun(searchPageQuery);
                    }
                  }}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-gray-800 placeholder-gray-400 transition-all duration-200"
                />
                <Search
                  className="absolute left-3.5 top-3.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm uppercase tracking-wide">
                Filter by category
              </label>
              <div className="relative">
                <select
                  value={searchPageGenre}
                  onChange={(e) => {
                    setSearchPageGenre(e.target.value);
                    setCurrentSearchPage(1);
                  }}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-gray-800 bg-white appearance-none cursor-pointer transition-all duration-200"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>

                <Filter
                  className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none"
                  size={20}
                />
                <ChevronRight
                  className="absolute right-3 top-3.5 text-gray-400 pointer-events-none rotate-90"
                  size={20}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-gray-700">
                Found{" "}
                <span className="font-bold text-blue-600 text-lg">
                  {filteredPosts.length}
                </span>{" "}
                {filteredPosts.length === 1 ? "post" : "posts"}
              </div>

              {searchPageGenre !== "All" && (
                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium text-sm">
                  {searchPageGenre}
                </span>
              )}
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[500px]">
            <img
              src="/public/tenor.gif"
              alt="Loading..."
              className="h-fit w-fit"
            />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={48} className="text-gray-300" />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No posts found
            </h3>

            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse different categories
            </p>

            <button
              onClick={() => {
                setSearchPageQuery("");
                setSearchPageGenre("All");
                setCurrentSearchPage(1);
              }}
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentPosts.map((post) => (
                <Link
                  key={post._id}
                  to={`/home/post/${post._id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                    <div className="relative overflow-hidden">
                      <img
                        src={post.image?.[0] || ""}
                        alt={post.topic}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      <div className="absolute top-3 right-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                        {Array.isArray(post.genre) ? post.genre[0] : post.genre}
                      </div>

                      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60"></div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                        <span className="flex items-center font-medium">
                          <Clock size={14} className="mr-1 text-blue-600" />
                          {post.date
                            ? new Date(post.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : ""}
                        </span>

                        <span className="flex items-center font-medium">
                          <Eye size={14} className="mr-1 text-blue-600" />
                          {post.views?.toLocaleString?.() ?? 0}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {post.topic}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed flex-1">
                        {Array.isArray(post.paragraph)
                          ? post.paragraph.join(" ")
                          : post.paragraph}
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

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10 bg-white rounded-xl shadow-md p-6">
              <button
                disabled={currentSearchPage === 1}
                onClick={() => setCurrentSearchPage((p) => Math.max(1, p - 1))}
                className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">
                  Page{" "}
                  <span className="text-blue-600 font-bold text-lg">
                    {currentSearchPage}
                  </span>{" "}
                  of <span className="font-bold">{totalPages}</span>
                </span>
              </div>

              <button
                disabled={currentSearchPage === totalPages}
                onClick={() =>
                  setCurrentSearchPage((p) => Math.min(totalPages, p + 1))
                }
                className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPostsPage;
