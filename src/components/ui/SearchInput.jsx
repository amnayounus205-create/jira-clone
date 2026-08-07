import { Search } from "lucide-react";

const SearchInput = ({
  value,
  onChange,
}) => {
  return (
    <div className="relative">

      <Search
        size={18}
        className="absolute left-3 top-3 text-gray-400"
      />

      <input
        value={value}
        onChange={onChange}
        placeholder="Search..."
        className="pl-10 pr-4 py-3 border rounded-lg w-full"
      />

    </div>
  );
};

export default SearchInput;