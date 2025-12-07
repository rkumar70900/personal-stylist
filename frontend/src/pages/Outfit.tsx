import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SearchBar from "@/components/outfit/SearchBar";
import OutfitDisplay from "@/components/outfit/OutfitDisplay";
import {
  searchStyleCandidates,
  extractPreferences,
  getBestOutfit,
  OutfitResult,
} from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

const Outfit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OutfitResult | null>(null);
  const [searchStage, setSearchStage] = useState<string>("");

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      // Step 1: Search for style candidates and extract preferences in parallel
      setSearchStage("Searching your wardrobe...");
      const [candidatesResult, preferencesResult] = await Promise.all([
        searchStyleCandidates(query),
        extractPreferences(query),
      ]);

      const { results: candidates } = candidatesResult;
      const { preferences } = preferencesResult;

      if (!candidates || candidates.length === 0) {
        toast.error("No matching items found in your wardrobe. Try uploading more clothes!");
        setIsLoading(false);
        return;
      }

      // Step 2: Score outfits and get the best one
      setSearchStage("Finding the perfect outfit...");
      const outfitResult = await getBestOutfit(
        candidates,
        preferences.occasion,
        preferences.weather,
        preferences.style_pref
      );

      setResult(outfitResult);
      toast.success("Found the perfect outfit for you!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to find outfit";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setSearchStage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Styling</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find Your Perfect Outfit
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us about your occasion, weather, or style preference and we'll curate
            the perfect outfit from your wardrobe.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-16 animate-slide-up">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center animate-pulse-glow">
                <Loader2 className="w-10 h-10 text-accent animate-spin" />
              </div>
            </div>
            <p className="mt-6 text-lg text-muted-foreground">{searchStage}</p>
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div className="animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Your Curated Outfit
              </h2>
              <p className="text-muted-foreground">
                From {result.total_combinations} possible combinations
              </p>
            </div>
            <OutfitDisplay outfit={result.best_outfit} />
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && (
          <div className="text-center py-16 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-primary/10 mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-accent/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                Ready to style you
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Enter a description of your occasion, the weather, or your desired style
                above, and we'll find the perfect outfit from your wardrobe.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Outfit;
