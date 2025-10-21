import type { User } from "../types/user.types";
import type { ChangeEvent } from "react";
import UserDropdown from "./user/UserDropdown";
import SearchBar from "./SearchBar";

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
        <SearchBar
          handleSearchChange={handleSearchChange}
          isLoading={isLoading}
          localSearch={localSearch}
        />
      </div>

      {/* User Menu */}
      <div className="flex flex-none items-center relative">
        <UserDropdown user={user} />
      </div>
    </header>
  );
}

export default Header;
