import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Thunk function to update sidebar open close based on width
export const updateSidebarBasedOnWidth = createAsyncThunk(
  "sidebar/updateBasedOnWidth",
  (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const width = state.window.windowWidth;

    if (width < 1024) {
      dispatch(closeSidebar());
    } else {
      dispatch(openSidebar());
    }
  },
);

interface SidebarState {
  isOpenSidebar: boolean;
}

const initialState: SidebarState = {
  isOpenSidebar: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpenSidebar = !state.isOpenSidebar;
    },
    openSidebar: (state) => {
      state.isOpenSidebar = true;
    },
    closeSidebar: (state) => {
      state.isOpenSidebar = false;
    },
    setSidebarOpenStatus: (state, action: PayloadAction<boolean>) => {
      state.isOpenSidebar = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  setSidebarOpenStatus,
} = sidebarSlice.actions;
export default sidebarSlice.reducer;
