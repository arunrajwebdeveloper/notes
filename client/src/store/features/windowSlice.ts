import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  windowWidth: typeof window !== "undefined" ? window.innerWidth : 0,
};

const windowSlice = createSlice({
  name: "window",
  initialState,
  reducers: {
    setWindowWidth: (state, action: PayloadAction<number>) => {
      state.windowWidth = action.payload;
    },
  },
});

export const { setWindowWidth } = windowSlice.actions;
export default windowSlice.reducer;
