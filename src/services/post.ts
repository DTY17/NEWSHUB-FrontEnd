import api from "./api";
import { isTokenValidAdmin } from "./auth";

interface Comment {
  user: string;
  date: string;
  text: string;
}

interface Post {
  topic: string;
  genre: string;
  views: number;
  paragraph: string[];
  image: string[];
  order: string[];
  comment: Comment[];
}

interface updatedPosts {
  _id: string;
  topic: string;
  genre: string;
  views: number;
  paragraph: string[];
  image: string[];
  order: string[];
}

export const getSearch = async (
  data: any,
  genre: string,
  page: number,
  token: string,
  user: string
) => {
  const search = data as string;
  const res = await api.post(
    `/post/search-post/${search}/${genre}/${page}/${user}`,
    {},
    {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(res.data.data);
  return res.data.data;
};

export const getPost = async () => {
  const res = await api.post(`/post/get-post/`);
  const res_data = res.data;
  const data: any[] = [];
  for (let i = 0; i < res_data.data.length; i++) {
    data.push(res_data.data[i]);
  }
  return data;
};

export const getPostID = async (id: string, token: string) => {
  console.log("id ", id);
  const res = await api.post(`/post/post-by-id/${id}`, {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const res_data = res.data;
  console.log("get", res_data.data);
  return res_data.data;
};

export const getCommentByPost = async (id: string, token: string) => {
  console.log(id);
  const res = await api.post(
    `/comment/get-by-post-comment/${id}`,
    {},
    {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log("get", res);
  return res.data;
};

export const savePost = async (data: Post, token: string) => {
  console.log({
    topic: data.topic,
    genre: data.genre,
    views: data.views,
    paragraph: data.paragraph,
    image: data.image,
    order: data.order,
    comment: data.comment,
  });

  const res = await api.post(
    `/post/save-post`,
    {
      topic: data.topic,
      genre: data.genre,
      views: data.views,
      paragraph: data.paragraph,
      image: data.image,
      order: data.order,
      comment: data.comment,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const res_data = res;
  console.log(res_data);
  return res_data;
};

export const recent = async (data: string) => {
  const res = await api.post(`/post/recent/${data}`);
  return res.data.data;
};

export const popular = async (data?: string) => {
  const res = await api.post(`/post/most-popular/${data}`);
  return res.data.data;
};

export const mostview = async (data: string) => {
  const res = await api.post(`/post/most-view/${data}`);
  return res.data.data;
};

export const updatePost = async (data: updatedPosts, token: string) => {
  console.log("input", {
    _id: data._id,
    topic: data.topic,
    genre: data.genre,
    views: data.views,
    paragraph: data.paragraph,
    image: data.image,
    order: data.order,
  });

  const res = await api.post(
    `/post/update`,
    {
      _id: data._id,
      topic: data.topic,
      genre: data.genre,
      views: data.views,
      paragraph: data.paragraph,
      image: data.image,
      order: data.order,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const res_data = res;
  console.log("data", res_data);
  return res_data;
};

export const deletePost = async (id: string, token: string) => {
  const res = await api.post(
    `/post/delete/${id}`,
    {},
    {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.message;
};

export const getCommet = async (id: string) => {
  const res = await api.post(`/post/delete/${id}`);
  return res.data.message;
};

export const getPostCount = async (token: string) => {
  try {
    const res = await api.post(
      `/post/count`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.count;
  } catch (err: any) {
    console.log("error ", err.response?.status === 403);
    if (err.response?.status === 403) {
      isTokenValidAdmin(
        localStorage.getItem("admin_token") as string,
        localStorage.getItem("admin_refresh_token") as string
      );
    }
  }
  return 0;
};

export const getViewCount = async (token: string) => {
  try {
    const res = await api.post(
      `/post/view-count`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.view;
  } catch (err: any) {
    console.log("error ", err.response?.status === 403);
    if (err.response?.status === 403) {
      isTokenValidAdmin(
        localStorage.getItem("admin_token") as string,
        localStorage.getItem("admin_refresh_token") as string
      );
    }
  }
  return 0;
};

export const setComment = async (
  post: string,
  user: string,
  comment: string,
  token: string
) => {
  const res = await api.post(
    `/comment/save-comment`,
    {
      post,
      user,
      comment,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(res);
  return res.data.data;
};

interface Comment {
  id: number;
  user: string;
  comment: string;
}

export const getCommetByAllIDS = async (token: string, data: string[]) => {
  const res = await api.post(
    `/comment/get-all-by-id`,
    { data },
    {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.data;
};

export const getLoadWatchlist = async (token: string, user: string) => {
  const res = await api.post(`/post/get-load-watchlist/${user}`, {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  console.log("Watchlist : ",res);
  return res.data.data;
};

export const setLoadWatchlist = async (
  token: string,
  user: string,
  post: string
) => {
  try {
    const res = await api.post(`/post/set-load-watchlist/${post}/${user}`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("data error : ", res);
    return res.data.data;
  } catch (err: any) {
    console.log(err)
  }
};

export const deleteLoadWatchlist = async (
  token: string,
  post: string,
  user: string
) => {
  const res = await api.post(`/post/delete-load-watchlist/${post}/${user}`, {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  console.log(res);
  return res.data.data;
};

export const getAiKey = async () => {
  const res = await api.get(`/getkey`);
  console.log(res);
  return res.data.key;
};
