import { Search } from "lucide-react";
import type { User } from "../types/user.types";
import type { ChangeEvent } from "react";

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
      <div className="flex flex-none items-center">
        <button className="flex items-center gap-4 text-left cursor-pointer w-10 h-10 md:w-12 md:h-12 border-3 border-slate-300 hover:border-t-blue-500 hover:border-l-blue-500 hover:border-r-amber-400 hover:border-b-amber-400  rounded-full transition duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
            role="img"
          >
            <g>
              <circle cx="64" cy="64" r="64" fill="#c1c7d0" />
              <g>
                <path
                  fill="#fff"
                  d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z"
                />
                <path
                  fill="#fff"
                  d="M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24"
                />
              </g>
            </g>
          </svg>
          {/* <div>
            <h3 className="text-base text-black m-0 leading-4">{`${
              user?.firstName
            } ${user?.lastName || ""}`}</h3>
            <span className="text-sm text-slate-600 m-0">{user?.email}</span>
          </div> */}
        </button>
      </div>
    </header>
  );
}

export default Header;
