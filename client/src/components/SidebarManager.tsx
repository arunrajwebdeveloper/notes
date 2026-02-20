import { useEffect } from "react";
import { setSidebarOpenStatus } from "../store/features/sidebarSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";

export const SidebarManager = () => {
  const dispatch = useAppDispatch();

  const { windowWidth } = useAppSelector((state) => state.window);
  const isSmallDevice = windowWidth < 1024;

  useEffect(() => {
    dispatch(setSidebarOpenStatus(!isSmallDevice));
  }, [isSmallDevice, dispatch]);

  return null;
};
