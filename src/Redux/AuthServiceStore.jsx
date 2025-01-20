// AuthServiceStore.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/AuthserviceF"; // Import the reducer from AuthSlice.js
// import adminReducer from "./features/AdminServiceF"
import roleReducer from "./features/RoleSlice";
import formReducer from "./features/PostServiceF";
const AuthServiceStore = configureStore({
  reducer: {
    auth: authReducer, // Register the auth reducer
    role: roleReducer,
    form: formReducer,
    // admin: adminReducer, // Add your admin slice to the store
  },
});

export default AuthServiceStore;
