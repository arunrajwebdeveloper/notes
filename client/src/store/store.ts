import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
  },
});

// 🔹 Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
