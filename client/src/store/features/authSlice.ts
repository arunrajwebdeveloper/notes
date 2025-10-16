// src/store/slices/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  setToken,
  setUser,
  clearAuth,
  getToken,
  getUser,
} from "../../utils/storage";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: getUser(),
  token: getToken(),
  isAuthenticated: !!getToken(),
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;

      setToken(action.payload.token);
    },
    setUserData: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      setUser(action.payload.user);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      clearAuth();
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      setUser(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setAccessToken, setUserData, logout, updateUser, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
