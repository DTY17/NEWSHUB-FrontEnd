import React, { useState } from "react";
import { genres } from "../data/data";
import { savePost } from "../services/post";
import upload from "../services/Upload";

export const AdminAddPost: React.FC = () => {
  const [form, setForm] = useState({
    title: "",
    genre: "Technology",
    date: new Date().toISOString(),
    content: [{ type: "Paragraph", value: "" }],
  });

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value as string }));
  };

  const addBlock = (type: "Paragraph" | "Image") => {
    setForm((f) => ({
      ...f,
      content: [...f.content, { type, value: "" }],
    }));
  };

  const ImageUploadFunction = async (file: File, i: number) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "News HUB"); 
      const res = await upload(formData);
      updateBlock(i, res.data.secure_url); 
      console.log("Uploaded image URL:", res.data.secure_url);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const updateBlock = (index: number, value: string) => {
    setForm((f) => {
      const updated = [...f.content];
      updated[index].value = value;
      return { ...f, content: updated };
    });
  };

  const removeBlock = (index: number) => {
    setForm((f) => {
      const updated = f.content.filter((_, i) => i !== index);
      return { ...f, content: updated };
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let images: string[] = [];
    let paragraphs: string[] = [];
    let orders: string[] = [];

    for (let i = 0; i < form.content.length; i++) {
      if (form.content[i].type === "Paragraph") {
        orders.push(form.content[i].type);
        paragraphs.push(form.content[i].value);
      }
      if (form.content[i].type === "Image") {
        orders.push(form.content[i].type);
        images.push(form.content[i].value);
      }
    }

    const newPost = {
      topic: form.title,
      genre: form.genre,
      views: 0,
      paragraph: paragraphs,
      image: images,
      order: orders,
      comment: [],
    };

    console.log("Saving post:", newPost);
    await savePost(newPost, localStorage.getItem("admin_token") as string);

    setForm({
      title: "",
      genre: "Technology",
      date: new Date().toISOString(),
      content: [{ type: "Paragraph", value: "" }],
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">Add Post</h1>
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl shadow-lg p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Title
          </label>
          <input
            name="title"
            value={form.title}
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
            {form.content.map((block, i) => (
              <div key={i} className="space-y-2">
                {block.type === "Paragraph" ? (
                  <textarea
                    value={block.value}
                    onChange={(e) => updateBlock(i, e.target.value)}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 text-gray-700"
                    rows={4}
                    placeholder="Enter paragraph..."
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          ImageUploadFunction(file, i);
                        }
                      }}
                      className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 text-gray-700"
                    />
                    {block.value && (
                      <img
                        src={block.value}
                        alt="Preview"
                        className="mt-2 max-h-48 rounded-lg border"
                      />
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeBlock(i)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
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
          Add Post
        </button>
      </form>
    </div>
  );
};
