import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
