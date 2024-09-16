import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="h-5 w-5 absolute left-2 top-1/2 -translate-y-1/2" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 py-2 w-full"
      />
    </div>
  );
}
