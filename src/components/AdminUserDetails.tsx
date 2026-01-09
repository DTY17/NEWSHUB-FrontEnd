
export interface UserData {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roles: string;
  watchlist: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const AdminUserDetails = ( user: UserData) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between border-b border-gray-200 last:border-0">
      <div className="flex items-center gap-3">
        <img
          src={user.image || "https://via.placeholder.com/100"}
          alt={user.firstname}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <h4 className="font-semibold text-sm text-black">{`${user.firstname} ${user.lastname}`}</h4>
          <p className="text-xs text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400">User</p>
          {/* <p className="text-xs text-gray-400">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </p> */}
        </div>
      </div>
      <div className="flex gap-2">
        {/* <button
          onClick={() => onEdit(user._id)}
          className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(user._id)}
          className="px-3 py-1 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700"
        >
          Delete
        </button> */}
      </div>
    </div>
  );
};
