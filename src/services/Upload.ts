import api from "./api";

const upload = async (data:FormData)=>{
  const res = api.post(
      "https://api.cloudinary.com/v1_1/dxxn3lxqw/image/upload",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  return res
}
export default upload

