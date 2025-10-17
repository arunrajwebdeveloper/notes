import { Search } from "lucide-react";

function Header() {
  return (
    <header className="w-full h-20 top-0 sticky bg-white flex items-center">
      <div className="flex items-center h-14 w-full max-w-xl">
        <div className="relative w-full">
          <Search className="absolute text-gray-900 z-10 left-0 top-1/2 transform -translate-y-1/2 pointer-events-none" />
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
