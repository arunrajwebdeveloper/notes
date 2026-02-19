import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import useWindowWidth from "../hooks/useWindowWidth";

interface SidebarContextProps {
  children?: ReactNode;
}

interface SidebarContextTypes {
  isOpenSidebar: boolean;
  windowWidth: number;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextTypes | undefined>(
  undefined,
);

const SidebarContextProvider = ({ children }: SidebarContextProps) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const windowWidth = useWindowWidth();
  const isSmallDevice = windowWidth < 1024;

  useEffect(() => {
    if (isSmallDevice) {
      setIsOpenSidebar(false);
    } else {
      setIsOpenSidebar(true);
    }
  }, [windowWidth]);

  const toggleSidebar = () => {
    setIsOpenSidebar((prev) => !prev);
  };

  const openSidebar = () => {
    setIsOpenSidebar(true);
  };

  const closeSidebar = () => {
    setIsOpenSidebar(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        isOpenSidebar,
        windowWidth,
        toggleSidebar,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error(
      "useSidebarContext must be used within a SidebarContextProvider",
    );
  }
  return context;
};
export default SidebarContextProvider;
