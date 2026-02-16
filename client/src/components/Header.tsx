import type { User } from "../types/user.types";
import type { ChangeEvent } from "react";
import UserDropdown from "./user/UserDropdown";
import SearchBar from "./SearchBar";
import { Menu, X } from "lucide-react";
import { useSidebarContext } from "../context/SidebarContext";
import { useAuth } from "../hooks/useAuth";

function Header({
  user,
  handleSearchChange,
  isLoading,
  localSearch,
}: {
  user: User | null;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  localSearch: string;
}) {
  const { logout } = useAuth();
  const { isOpenSidebar, toggleSidebar } = useSidebarContext();

  return (
    <header className="w-full h-16 md:h-20 top-0 sticky bg-white flex items-center justify-between z-50 gap-4">
      <div className="flex items-center h-10 md:h-14 w-full gap-6 lg:gap-0">
        {/* Logo */}
        <div className="flex items-center gap-x-3 lg:hidden">
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 flex cursor-pointer bg-slate-50 rounded-sm"
          >
            {isOpenSidebar ? (
              <X size={24} className="m-auto" />
            ) : (
              <Menu size={24} className="m-auto" />
            )}
          </button>
          <h2 className="text-2xl md:text-3xl font-semibold text-black m-0 select-none">
            NOTI
          </h2>
        </div>

        {/* Search bar */}
        <SearchBar
          handleSearchChange={handleSearchChange}
          isLoading={isLoading}
          localSearch={localSearch}
        />
      </div>

      {/* User Menu */}
      <div className="flex flex-none items-center relative">
        <UserDropdown user={user} logout={logout} />
      </div>
    </header>
  );
}

export default Header;
