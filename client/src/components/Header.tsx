import { Search } from "lucide-react";
import type { User } from "../types/auth.types";

function Header({ user }: { user: User | null }) {
  return (
    <header className="w-full h-20 top-0 sticky bg-white flex items-center justify-between z-50">
      <div className="flex items-center h-14 w-full max-w-lg">
        <div className="relative w-full">
          <Search className="absolute text-gray-900 z-10 left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Notes"
            className=" border-0 rounded-lg bg-slate-100 text-gray-900 text-lg outline-0 block w-full ps-12 p-3"
          />
        </div>
      </div>

      {/* User Menu */}
      <div className="h-[80px] flex flex-none items-center px-6">
        <button className="flex items-center gap-4 text-left cursor-pointer w-12 h-12 border-3 border-slate-300 hover:border-t-blue-500 hover:border-l-blue-500 hover:border-r-amber-400 hover:border-b-amber-400  rounded-full transition duration-300">
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
