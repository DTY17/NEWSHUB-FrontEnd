// src/pages/SearchData.tsx
import React, { useCallback, useEffect, useState } from "react";
import SearchPostsPage from "../components/SearchPostsPage";
import { getSearch } from "../services/post";

const genres = [
  "All",
  "Technology",
  "Environment",
  "Sports",
  "Health",
  "Business",
  "Travel",
  "Politics",
  "Entertainment",
];

export type Post = {
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

type SearchDataProps = {
  searchData?: string;
};

const SearchData: React.FC<SearchDataProps> = ({ searchData = "" }) => {
  const [searchPageQuery, setSearchPageQuery] = useState<string>(
    searchData || ""
  );
  const [searchPageGenre, setSearchPageGenre] = useState<string>("All");
  const [currentSearchPage, setCurrentSearchPage] = useState<number>(1);
  const postsPerPage = 9;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    let mounted = true;
    async function fetchPosts() {
      try {
        setLoading(true)
        const data = await getSearch(
          searchPageQuery,
          searchPageGenre,
          currentSearchPage,
          localStorage.getItem("token") as string
        );
        if (!mounted) return;
        if (Array.isArray(data)) setPosts(data);
        else setPosts([]);
      } catch (err) {
        console.error("fetchPosts error:", err);
        setPosts([]);
      } finally {
        setLoading(false)
      }
    }
    void fetchPosts();
    return () => {
      mounted = false;
    };
  }, [searchPageGenre, currentSearchPage]);

  const searchDataFun = useCallback(
    async (inp: string) => {
      try {
        setLoading(true)
        const data = await getSearch(
          inp,
          searchPageGenre,
          currentSearchPage,
          localStorage.getItem("token") as string
        );
        if (Array.isArray(data)) setPosts(data);
        else setPosts([]);
      } catch (err) {
        console.error("searchDataFun error:", err);
        setPosts([]);
      } finally {
        setLoading(false)
      }
    },
    [searchPageGenre, currentSearchPage]
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      <SearchPostsPage
        loading = {loading}
        posts={posts}
        searchPageQuery={searchPageQuery}
        setSearchPageQuery={setSearchPageQuery}
        searchPageGenre={searchPageGenre}
        setSearchPageGenre={setSearchPageGenre}
        currentSearchPage={currentSearchPage}
        setCurrentSearchPage={setCurrentSearchPage}
        postsPerPage={postsPerPage}
        searchDataFun={searchDataFun}
        genres={genres}
      />
    </div>
  );
};

export default SearchData;
