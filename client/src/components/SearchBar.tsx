import { Search } from "lucide-react";
import type { ChangeEvent } from "react";
import { memo, useEffect, useRef } from "react";

function SearchBar({
  handleSearchChange,
  isLoading,
  localSearch,
}: {
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  localSearch: string;
}) {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [localSearch]);
  return (
    <div className="relative w-full max-w-sm hover:max-w-lg transition-all duration-300">
      <Search className="absolute w-5 h-5 text-gray-500 z-10 left-0 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      <input
        ref={ref}
        type="text"
        placeholder="Search Notes"
        className=" border-0 rounded-lg bg-white text-gray-500 text-md outline-0 block w-full h-12 md:h-14 ps-8 pe-3"
        onChange={handleSearchChange}
        disabled={isLoading}
        value={localSearch}
      />
    </div>
  );
}

export default memo(SearchBar);
