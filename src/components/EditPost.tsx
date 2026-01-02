// src/admin/AdminEditPost.tsx
import React, { useState, useEffect } from "react";
import { genres } from "../data/data";
import { getPostID, updatePost } from "../services/post";
import upload from "../services/Upload"; // Cloudinary upload service
import { useParams, useNavigate } from "react-router-dom";

interface Post {
  _id: string;
  topic: string;
  genre: string;
  views: number;
  date: string;
  paragraph: string[];
  image: string[];
  order: string[];
}

export const AdminEditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Post>({
    _id: id as string,
    topic: "",
    genre: "Technology",
    views: 0,
    date: new Date().toISOString(),
    paragraph: [],
    image: [],
    order: [],
  });

  // Load existing post
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const post = await getPostID(id, localStorage.getItem("admin_token") as string);
      console.log(post);
      setForm(post);
    };
    fetchPost();
  }, [id]);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const addBlock = (type: "Paragraph" | "Image") => {
    setForm((f) => ({
      ...f,
      order: [...f.order, type],
      paragraph: type === "Paragraph" ? [...f.paragraph, ""] : f.paragraph,
      image: type === "Image" ? [...f.image, ""] : f.image,
    }));
  };

  const ImageUploadFunction = async (file: File, i: number) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "News HUB"); // your Cloudinary preset
      const res = await upload(formData);
      const updated = [...form.image];
      updated[i] = res.data.secure_url;
      setForm({ ...form, image: updated });
      console.log("Uploaded image URL:", res.data.secure_url);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form", form._id);
    await updatePost(form,localStorage.getItem("admin_token") as string);
    navigate("/admin/manage");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">Edit Post</h1>
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl shadow-lg p-6 space-y-4"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Title
          </label>
          <input
            name="topic"
            value={form.topic}
            onChange={onChange}
            className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 text-gray-700"
          />
        </div>

        {/* Dynamic content blocks */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Content Blocks
          </label>
          <div className="space-y-4">
            {(() => {
              let paragraphIndex = 0;
              let imageIndex = 0;

              return form.order.map((block, i) => {
                if (block === "Paragraph") {
                  const currentIndex = paragraphIndex++;
                  return (
                    <div key={i} className="space-y-2">
                      <textarea
                        value={form.paragraph[currentIndex] || ""}
                        onChange={(e) => {
                          const updated = [...form.paragraph];
                          updated[currentIndex] = e.target.value;
                          setForm({ ...form, paragraph: updated });
                        }}
                        className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 text-gray-700"
                        rows={4}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newOrder = [...form.order];
                          newOrder.splice(i, 1);
                          const newParagraphs = [...form.paragraph];
                          newParagraphs.splice(currentIndex, 1);
                          setForm({
                            ...form,
                            order: newOrder,
                            paragraph: newParagraphs,
                          });
                        }}
                        className="text-red-500 text-sm"
                      >
                        Remove Paragraph
                      </button>
                    </div>
                  );
                }
                if (block === "Image") {
                  const currentIndex = imageIndex++;
                  return (
                    <div key={i} className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            ImageUploadFunction(file, currentIndex);
                          }
                        }}
                        className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 text-gray-700"
                      />
                      {form.image[currentIndex] && (
                        <img
                          src={form.image[currentIndex]}
                          alt="Preview"
                          className="mt-2 max-h-48 rounded-lg border"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const newOrder = [...form.order];
                          newOrder.splice(i, 1);
                          const newImages = [...form.image];
                          newImages.splice(currentIndex, 1);
                          setForm({
                            ...form,
                            order: newOrder,
                            image: newImages,
                          });
                        }}
                        className="text-red-500 text-sm"
                      >
                        Remove Image
                      </button>
                    </div>
                  );
                }
                return null;
              });
            })()}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => addBlock("Paragraph")}
              className="px-3 py-1 bg-indigo-100 rounded"
            >
              + Paragraph
            </button>
            <button
              type="button"
              onClick={() => addBlock("Image")}
              className="px-3 py-1 bg-indigo-100 rounded"
            >
              + Image
            </button>
          </div>
        </div>

        {/* Genre & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Genre
            </label>
            <select
              name="genre"
              value={form.genre}
              onChange={onChange}
              className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 text-gray-700"
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date ? form.date.split("T")[0] : ""}
              onChange={onChange}
              className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 text-gray-700"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-semibold"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};
