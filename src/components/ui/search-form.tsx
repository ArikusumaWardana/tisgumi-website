import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchFormProps {
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export function SearchForm({
  placeholder = "Search...",
  defaultValue = "",
  className = "",
}: SearchFormProps) {
  return (
    <form method="get" className={`flex gap-2 max-w-md ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="search"
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="pl-10"
        />
      </div>

      <Button type="submit" size="default">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>

      <input type="hidden" name="page" value="1" />
    </form>
  );
}
