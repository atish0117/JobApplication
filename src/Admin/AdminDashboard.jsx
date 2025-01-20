// // src/components/AdminDashboard.jsx

// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchUsers, deleteUser } from "../Redux/features/AdminServiceF"; // Make sure path is correct

// const AdminDashboard = () => {
//   const dispatch = useDispatch();
//   const { users, loading, error } = useSelector((state) => state.admin);

//   React.useEffect(() => {
//     dispatch(fetchUsers()); // Fetch users when the component mounts
//   }, [dispatch]);

//   const handleDelete = (userId) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       dispatch(deleteUser(userId)); // Dispatch delete action
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-yellow-500 mb-4">Admin Dashboard</h1>

//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       <div className="bg-white shadow rounded p-4">
//         <h2 className="text-2xl font-semibold mb-4">User Management</h2>
//         <table className="w-full table-auto border-collapse">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Email</th>
//               <th className="border p-2">Role</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id} className="hover:bg-gray-100">
//                 <td className="border p-2">{user.fullName}</td>
//                 <td className="border p-2">{user.email}</td>
//                 <td className="border p-2 capitalize">{user.role}</td>
//                 <td className="border p-2 text-center">
//                   <button
//                     className="text-red-500 hover:underline"
//                     onClick={() => handleDelete(user.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
