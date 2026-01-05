import axios from "axios"


// create auth
const api = axios.create({
  baseURL: "https://abcbe.vercel.app/api/abc/"
})

const PUBLIC_ENDPOINTS = ["user/login", "/user/register"]

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  const isPUblic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))
  if (!isPUblic && token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
