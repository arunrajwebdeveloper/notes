import { type ReactNode } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      <Header />
      <div className="flex w-full">
        <div className="">
          <Sidebar />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default MainLayout;
