import React, { useState } from "react";

export const AdminSettings: React.FC = () => {

  // Profile/account settings
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">Settings</h1>
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">

        {/* Username */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2"
          />
        </div>

        {/* Profile picture */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="w-full text-gray-700"
          />
          {profilePic && (
            <p className="text-xs text-gray-500 mt-1">Selected: {profilePic.name}</p>
          )}
        </div>

        {/* About/Bio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">About</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2"
            rows={3}
          />
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2"
          />
        </div>

        {/* Save button */}
        <button className="px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-semibold">
          Save Settings
        </button>
      </div>
    </div>
  );
};
