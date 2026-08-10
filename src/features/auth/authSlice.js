import { createSlice } from "@reduxjs/toolkit";

const getStoredAuth = () => {
  try {
    const localAuth = localStorage.getItem("auth");

    if (localAuth) {
      return JSON.parse(localAuth);
    }

    const sessionAuth =
      sessionStorage.getItem("auth");

    if (sessionAuth) {
      return JSON.parse(sessionAuth);
    }
  } catch (error) {
    console.error(
      "Failed to read stored auth:",
      error
    );
  }

  return null;
};

const savedAuth = getStoredAuth();

const initialState = {
  user: savedAuth?.user || null,
  token: savedAuth?.token || null,
  isAuthenticated: Boolean(savedAuth?.token),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = Boolean(token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear current auth storage
      localStorage.removeItem("auth");
      sessionStorage.removeItem("auth");

      // Clear old auth storage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const {
  loginSuccess,
  logout,
} = authSlice.actions;

export default authSlice.reducer;