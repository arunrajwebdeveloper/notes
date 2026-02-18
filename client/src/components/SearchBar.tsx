import { Search, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { memo, useEffect, useRef } from "react";

function SearchBar({
  handleSearchChange,
  isLoading,
  localSearch,
  clearSearchModal,
  showClose = false,
}: {
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  showClose: boolean;
  localSearch: string;
  clearSearchModal: () => void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [localSearch]);

  return (
    <div className="relative w-full max-w-lg transition-all duration-300">
      <Search className="absolute w-5 h-5 text-gray-500 z-10 left-0 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      <input
        ref={ref}
        type="text"
        placeholder="Search Notes"
        className="border-0 rounded-lg bg-white text-gray-500 text-md outline-0 block w-full h-12 md:h-14 ps-8 pe-12"
        onChange={handleSearchChange}
        disabled={isLoading}
        value={localSearch}
      />
      {showClose && (
        <button
          onClick={clearSearchModal}
          className="absolute z-10 right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 flex outline-0 border-0 cursor-pointer select-none"
        >
          <X size={24} className=" w-5 h-5 text-gray-500 m-auto" />
        </button>
      )}
    </div>
  );
}

export default memo(SearchBar);
