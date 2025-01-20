import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../appWrite/AppwriteConfig"
// import adminService from '../../appWrite/adminService';


// Define authorized admin credentials
// const authorizedAdminCredentials = {
//   email: "admin@example.com",  // Replace with your actual admin email
//   password: "adminPassword123"  // Replace with your actual admin password
// };

// Thunks for fetching users and deleting a user
// export const fetchUsers = createAsyncThunk(
//   'auth/fetchUsers',
//   async (_, { rejectWithValue }) => {
//     try {
//       const users = await adminService.fetchUsers();
//       return users;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// export const deleteUser = createAsyncThunk(
//   'auth/deleteUser',
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await adminService.deleteUser(userId);
//       return userId; // Return userId to handle the state update in reducers
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );


// Thunk for signup with verification
export const signup = createAsyncThunk(
  "auth/signup",
  async ({ fullName, email, password }, { rejectWithValue }) => {
    console.log("data=",fullName,email,password)
    try {
      const user = await authService.signup({ fullName, email, password });
      console.log(user)
      return user;
    } catch (err) {
      console.log(err.message)
      return rejectWithValue(err.message);
    }
  }
);

// Thunk for verifying email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ userId, secret }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(userId, secret);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// export const login = createAsyncThunk(
//   "auth/login",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       // Check if the credentials match the admin's credentials
//       // const isAdmin =
//       //   email === authorizedAdminCredentials.email &&
//       //   password === authorizedAdminCredentials.password;

//       // Perform login
//       const session = await authService.login({ email, password });

//       // Include the isAdmin flag in the response
//       // return { ...session, isAdmin };
//       return session
//     } catch (err) {
//       // Reject with an error message if login fails
//       return rejectWithValue(err.message);
//     }
//   }
// );


export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const session = await authService.login({ email, password });
      // Retrieve current user details after login
      const user = await authService.getCurrentUser();
      return { session, user }; // Include both session and user in the response
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk for password recovery
export const recoverPassword = createAsyncThunk(
  "auth/recoverPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.recoverPassword(email);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk for password reset
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ userId, secret, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(userId, secret, newPassword);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAdmin: false, // Admin flag
    userId: null,
    email: null,
    session: null,
    recoveryStatus: null,
    verificationStatus: null,
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // // Fetch users
      // .addCase(fetchUsers.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(fetchUsers.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.users = action.payload;
      // })
      // .addCase(fetchUsers.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })

      //  // Delete user
      // .addCase(deleteUser.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(deleteUser.fulfilled, (state, action) => {
      //   state.loading = false;
      //   // Remove the user from the users array
      //   state.users = state.users.filter((user) => user.id !== action.payload);
      // })
      // .addCase(deleteUser.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })

      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle verifyEmail action
      builder.addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationStatus = action.payload || "Email verified successfully!";
        state.error = null;
      });
      builder.addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.verificationStatus = null;
        state.error = action.payload || "Verification failed. Please try again.";
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;


        // Check if the logged-in user is an admin
        // state.isAdmin =
        //   action.payload.email === "admin@example.com" &&
        //   action.payload.password === "secureAdminPassword123"; // Replace with your admin credentials
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logout.fulfilled, (state) => {
        // Reset the state on successful logout
        state.userId = null;
        state.email = null;
        state.session = null;
        state.isAdmin = false; // Reset admin flag
        state.loading = false;
        state.error = null;
        state.isLoggedIn = false; // Reset the logged-in status
      })

      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      })

       // Password Recovery
      .addCase(recoverPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recoverPassword.fulfilled, (state) => {
        state.loading = false;
        state.recoveryStatus = "Recovery email sent successfully.";
      })
      .addCase(recoverPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       // Password Reset
       .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.recoveryStatus = "Password reset successfully.";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
