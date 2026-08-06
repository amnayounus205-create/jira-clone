import { Bell, Search } from "lucide-react";

const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

      <h1 className="text-xl font-bold text-primary">
        Jira Clone
      </h1>

      <div className="flex items-center gap-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg border outline-none"
          />

        </div>

        <Bell className="cursor-pointer"/>

        <img
          src="https://i.pravatar.cc/40"
          className="rounded-full"
        />

      </div>

    </header>
  );
};

export default Navbar;