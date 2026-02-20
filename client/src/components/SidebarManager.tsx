import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { updateSidebarBasedOnWidth } from "../store/features/sidebarSlice";

export const SidebarManager = () => {
  const dispatch = useAppDispatch();

  const { windowWidth } = useAppSelector((state) => state.window);

  useEffect(() => {
    dispatch(updateSidebarBasedOnWidth());
  }, [windowWidth, dispatch]);

  return null;
};
