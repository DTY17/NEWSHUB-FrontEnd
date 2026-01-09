
import { useEffect, useState } from "react";
import { AdminUserDetails, type UserData } from "./AdminUserDetails";
import { getAllUsers } from "../services/auth";

export const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(()=>{
    async function getUsers(){
      const res = await getAllUsers(localStorage.getItem("admin_token") as string)
      setUsers(res)
      console.log(res)
    }
    getUsers()
  },[])

  // const handleEdit = (id: string) => {
  //   console.log("Edit user:", id);
  //   // navigate(`/admin/users/${id}`);
  // };

  // const handleDelete = (id: string) => {
  //   console.log("Delete user:", id);
  //   setUsers(users.filter((u) => u._id !== id));
  // };

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">Manage Users</h1>
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        {users.length === 0 ? (
          <p className="text-gray-500">No users available.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user : UserData) => (
              <li key={user._id}>
                {/* Pass user data as props directly, not as an object */}
                <AdminUserDetails
                  _id={user._id}
                  firstname={user.firstname}
                  lastname={user.lastname}
                  email={user.email}
                  password={user.password}
                  roles={user.roles}
                  watchlist={user.watchlist}
                  image={user.image}
                  createdAt={user.createdAt}
                  updatedAt={user.updatedAt}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};