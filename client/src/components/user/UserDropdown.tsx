import { useState, useRef, useEffect } from "react";
import type { User } from "../../types/user.types";
import { LayoutGrid, LogOut, Rows2, Settings2 } from "lucide-react";
import { useAppDispatch } from "../../hooks";
import { logout } from "../../store/features/authSlice";

function UserDropdown({ user }: { user: User | null }) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isShow, setIsShow] = useState(false);

  const dispatch = useAppDispatch();

  const logoutUser = () => {
    dispatch(logout());
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsShow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShow]);

  return (
    <div className="relative select-none" ref={menuRef}>
      <button
        onClick={() => setIsShow((prev) => !prev)}
        className={`flex items-center gap-4 text-left cursor-pointer w-10 h-10 md:w-12 md:h-12 border-3 rounded-full transition duration-300 ${
          isShow
            ? "border-t-blue-500 border-l-blue-500 border-r-amber-400 border-b-amber-400"
            : "border-slate-300"
        }`}
      >
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
      </button>

      {/* User dropdown */}

      {isShow && (
        <div className="absolute w-50 top-14 right-0 bg-white shadow-sm border border-slate-100 rounded-lg z-50">
          <div className="px-4 py-2 leading-1">
            <span className="text-sm text-black mb-0 block whitespace-nowrap overflow-hidden text-ellipsis max-w-full">{`${
              user?.firstName
            } ${user?.lastName || ""}`}</span>
            <span className="text-xs text-slate-600 m-0 whitespace-nowrap overflow-hidden text-ellipsis max-w-full block">
              {user?.email}
            </span>
          </div>
          <div className="space-y-1 py-2 mt-1 border-t border-t-slate-200">
            <button className="flex w-full text-sm text-slate-700 h-10 cursor-pointer items-center gap-3 px-4 hover:bg-slate-100">
              <Settings2 size={18} />
              <span>Settings</span>
            </button>
            {/* <button className="flex w-full text-sm text-slate-700 h-10 cursor-pointer items-center gap-3 px-4 hover:bg-slate-100">
              <LayoutGrid size={18} />
              <Rows2 />
              <span>Layout</span>
            </button> */}
            <button
              onClick={logoutUser}
              className="flex w-full text-sm text-slate-700 h-10 cursor-pointer items-center gap-3 px-4 hover:bg-slate-100"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
