import { Search } from "lucide-react";
import type { User } from "../types/user.types";
import type { ChangeEvent } from "react";
import UserDropdown from "./user/UserDropdown";

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
  return (
    <header className="w-full h-16 md:h-20 top-0 sticky bg-white flex items-center justify-between z-50 gap-4">
      <div className="flex items-center h-10 md:h-14 w-full gap-6 lg:gap-0">
        {/* Logo */}
        <div className="block lg:hidden">
          <h2 className="text-2xl md:text-3xl font-semibold text-black m-0 select-none">
            NOTI
          </h2>
        </div>

        {/* Search bar */}
        <div className="relative w-full max-w-lg">
          <Search className="absolute w-5 h-5 md:w-6 md:h-6 text-gray-900 z-10 left-2 md:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Notes"
            className=" border-0 rounded-lg bg-slate-100 text-gray-900 text-md md:text-lg outline-0 block w-full h-12 md:h-14 ps-10 md:ps-12 pe-3"
            onChange={handleSearchChange}
            disabled={isLoading}
            value={localSearch}
          />
        </div>
      </div>

      {/* User Menu */}
      <div className="flex flex-none items-center relative">
        <UserDropdown user={user} />
      </div>
    </header>
  );
}

export default Header;
