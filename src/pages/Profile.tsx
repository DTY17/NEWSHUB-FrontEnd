import { useEffect, useState, type FC } from "react";
import { Camera, Save, UserCircle2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { getUser, UpdateData } from "../services/auth";
import upload from "../services/Upload";

type ProfileData = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
};

const initialProfile: ProfileData = {
  username: "janedoe",
  email: "jane.doe@example.com",
  firstName: "Jane",
  lastName: "Doe",
  avatarUrl: "ABC-NEWS/src/assets/user.png",
};

interface Props {
  setDP: (p: string) => void;
  dp: string
}

export const Profile: FC<Props> = ({ setDP , dp }) => {
  const { email } = useParams();
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [image_icon,setImage_icon] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      console.log("Emails :: ",email)
      console.log(image_icon)
      const data = await getUser(email as string , localStorage.getItem("token") as string);
      console.log("data recived",data)
      const profile_data = {
        username: data.firstname,
        email: data.email,
        firstName: data.firstname,
        lastName: data.lastname,
        avatarUrl: data.image != "" ? data.image : "ABC-NEWS/src/assets/user.png",
      };
      setProfile(profile_data);
      console.log(profile_data);
    }
    loadData();
  }, []); // email

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onChange = <K extends keyof ProfileData>(
    key: K,
    value: ProfileData[K]
  ) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarUpload  = async (e:any) => {
    const file = e.target.files?.[0]; 
    if (!file) return; 
    const formData = new FormData(); 
    formData.append("file", file); 
    formData.append("upload_preset", "News HUB");
    const res = await upload(formData)
    setDP(res.data.secure_url)
    setImage_icon(res.data.secure_url)
    console.log(res.data.secure_url)
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (!profile.username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!validateEmail(profile.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      onChange("avatarUrl",dp)
      console.log("profile ",profile)
      const isUpdated = await UpdateData(
        profile , 
        localStorage.getItem("token") as string , 
        localStorage.getItem("email") as string
      ) 
      if(isUpdated.data === "Updated") {
        setSaving(true);
        setSuccess("Profile updated successfully.");
      }
    } catch (e) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 ">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 p-6 text-white">
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <p className="text-sm text-indigo-100 mt-1">
              Update your information and personalize your account.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 ">
            <div className="bg-white border rounded-xl p-4 flex flex-col items-center">
              <div className="relative ">
                {dp === "" ? (
                  <img
                    src={dp}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover border shadow"
                  />
                ) : profile.avatarUrl ? (
                  <img
                    src={dp}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border shadow"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border">
                    <UserCircle2 className="text-gray-400" size={64} />
                  </div>
                )}
                <label
                  htmlFor="avatar"
                  className="cursor-pointer absolute -bottom-2 -right-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-full p-2 shadow hover:scale-105 transition"
                  title="Change profile picture"
                >
                  <Camera size={18} />
                </label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
              <p className="text-xs text-gray-500 mt-3">
                PNG, JPG, or WebP. Recommended square image.
              </p>
            </div>

            <div className="space-y-6 ">
              <section className="bg-white border rounded-xl p-4">
                <h2 className="text-lg font-semibold text-indigo-800">
                  Identity
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First name
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => onChange("firstName", e.target.value)}
                      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => onChange("lastName", e.target.value)}
                      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Doe"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => onChange("username", e.target.value)}
                      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="janedoe"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white border rounded-xl p-4">
                <h2 className="text-lg font-semibold text-indigo-800">
                  Contact
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => onChange("email", e.target.value)}
                      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="jane.doe@example.com"
                    />
                  </div>
                </div>
              </section>

              <div className="flex items-center justify-between">
                <div className="min-h-6">
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  {success && (
                    <p className="text-green-600 text-sm">{success}</p>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-5 py-2.5 rounded-lg text-white font-semibold flex items-center gap-2 transition
                    ${
                      saving
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-linear-to-r from-indigo-500 to-purple-600 hover:scale-[1.02] hover:shadow-lg"
                    }`}
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
