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
  }, [localSearch, isLoading]);
  return (
    <div className="relative w-full max-w-lg">
      <Search className="absolute w-5 h-5 md:w-6 md:h-6 text-gray-900 z-10 left-2 md:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      <input
        ref={ref}
        type="text"
        placeholder="Search Notes"
        className=" border-0 rounded-lg bg-slate-100 text-gray-900 text-md md:text-lg outline-0 block w-full h-12 md:h-14 ps-10 md:ps-12 pe-3"
        onChange={handleSearchChange}
        disabled={isLoading}
        value={localSearch}
      />
    </div>
  );
}

export default memo(SearchBar);
