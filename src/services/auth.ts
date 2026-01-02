import api from "./api";

interface RegisterProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

type ProfileData = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
};

interface LoginProps {
  email: string;
  password: string;
}

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterProps) => {
  try {
    const res = await api.post("user/register", {
      firstname: firstName,
      lastname: lastName,
      email,
      password,
      watchlist: [],
    });

    console.log(res.data.message);
    if (res.data.message === "User registed") {
      return (res.data.condition = 200);
    }

    return res.data;
  } catch (error) {
    console.error("Registration failed:", error);
  }
};

export const login = async ({ email, password }: LoginProps) => {
  try {
    const res = await api.post("user/login", { email, password });
    // console.log(res)
    if (res.data.message === "User registed") {
      res.data.condition == 200;
      return res.data.data;
    }
    return res.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        data.condition = 401;
        return data;
      }
      if (status === 403) {
        data.condition = 403;
        return data;
      }
    } else {
      //console.error("Unexpected error:", error)
      return JSON.stringify({
        condition: "Unexpected error",
      });
    }
  }
};

export const getUser = async (email: string , token: string) => {
  try {
    const res = await api.post(`user/user-detail/${email}`,{},{
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    console.log(res);
    return res.data.data;
  } catch (error) {
    console.log(error);
    return "Error";
  }
};

export const refreshToken = async (token: string) => {
  try {
    const refreshRes = await api.post(`user/refresh/${token}`);
    console.log(refreshRes.data.message === false);
    console.log(refreshRes.data);
    if (refreshRes.data.message === false) {
      console.log("refresh expire");
      refreshRes.data.condition = false;
      return false;
    } else {
      localStorage.setItem("token", refreshRes.data.token);
      refreshRes.data.condition = true;
      return true;
    }
  } catch (refreshErr) {
    console.log(refreshErr);
  }
};

export const isTokenValid = async (token: string, refresh_token: string) => {
  try {
    const res = await api.get(
      `user/valid/${token}`);
    if (res.data.message === false) {
      console.log("expire");
      const newToken = await refreshToken(refresh_token);
      res.data.condition = false;
      return newToken;
    } else {
      res.data.condition = true;
      return true;
    }
  } catch (err: any) {
    console.log(err);
  }
};

export const loginAdmin = async ({ email, password }: LoginProps) => {
  try {
    const res = await api.post("user/admin/login", {
      email,
      password,
    });
    console.log(res.data);
    if (res.status == 403) {
      return (res.data.condition = 403);
    }

    if (res.data.message === "Admin Login") {
      return (res.data.condition = "Admin Login");
    }
    return res.data;
  } catch (error) {
    console.error("login failed:", error);
  }
};

export const refreshTokenAdmin = async (token: string) => {
  try {
    const refreshRes = await api.post(`user/refresh/${token}`);
    console.log(refreshRes.data.message === false);
    console.log(refreshRes.data);
    if (refreshRes.data.message === false) {
      console.log("refresh expire");
      refreshRes.data.condition = false;
      return false;
    } else {
      localStorage.setItem("admin_token", refreshRes.data.token);
      refreshRes.data.condition = true;
      return true;
    }
  } catch (refreshErr) {
    console.log(refreshErr);
    return false;
  }
};

export const isTokenValidAdmin = async (
  token: string,
  refresh_token: string
) => {
  try {
    const res = await api.get(`user/valid/${token}`);
    if (res.data.message === false) {
      console.log("expire");
      const newToken = await refreshTokenAdmin(refresh_token);
      res.data.condition = false;
      return newToken;
    } else {
      res.data.condition = true;
      return true;
    }
  } catch (err: any) {
    console.log(err);
  }
};

export const UpdateData = async (
  data: ProfileData,
  token: string,
  id: string
) => {
  try {
    console.log("data update", data);
    const res = await api.post(`user/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Update failed:", error);
    throw error;
  }
};
