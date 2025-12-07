import { useState } from "react";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const suggestions = [
    "Smart casual for a dinner date",
    "Business meeting on a rainy day",
    "Weekend brunch, sunny weather",
    "Night out, trendy and bold",
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your occasion, weather, or style..."
            className={cn(
              "w-full h-14 pl-12 pr-32 rounded-xl border bg-card text-foreground",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
              "shadow-soft transition-all duration-300",
              "focus:shadow-card"
            )}
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            disabled={!query.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Find Outfit
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-2 justify-center">
        <span className="text-sm text-muted-foreground">Try:</span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setQuery(suggestion)}
            className="px-3 py-1.5 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-accent/20 hover:text-accent transition-colors"
            disabled={isLoading}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
