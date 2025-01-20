// // AdminSlice.jsx

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import adminService from "../../appWrite/adminService"; // or wherever you define your adminService

// // Fetch users action
// export const fetchUsers = createAsyncThunk(
//   "admin/fetchUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const users = await adminService.fetchUsers();
//       return users;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// // Delete user action
// export const deleteUser = createAsyncThunk(
//   "admin/deleteUser",
//   async (userId, { rejectWithValue }) => {
//     try {
//       await adminService.deleteUser(userId);
//       return userId; // Return the userId to handle the state update in reducers
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// const adminSlice = createSlice({
//   name: "admin",
//   initialState: {
//     users: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUsers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.users = action.payload;
//       })
//       .addCase(fetchUsers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(deleteUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteUser.fulfilled, (state, action) => {
//         state.loading = false;
//         // Remove the deleted user from the users array
//         state.users = state.users.filter((user) => user.id !== action.payload);
//       })
//       .addCase(deleteUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default adminSlice.reducer;
// // export { fetchUsers, deleteUser }; // Ensure `deleteUser` is exported
