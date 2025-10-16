import { Search } from "lucide-react";

function Header() {
  return (
    <header className="w-full h-14 px-6 my-6">
      <div className="flex items-center h-full">
        <div className="relative w-xl">
          <Search className="absolute z-10 left-0 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Notes"
            className=" border-0 text-gray-900 text-lg rounded-lg outline-0 block w-full ps-10 p-3"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
