// src/redux/roleSlice.js
import { createSlice } from "@reduxjs/toolkit";

const roleSlice = createSlice({
  name: "role",
  initialState: {
    role: null,
    loading: false,
    error: null,
  },
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    clearRole: (state) => {
      state.role = null;
    },
  },
});

export const { setRole, clearRole } = roleSlice.actions;

export default roleSlice.reducer;
