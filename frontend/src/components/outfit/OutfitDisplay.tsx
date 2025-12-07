import { ClothingItem, getImageUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface OutfitDisplayProps {
  outfit: {
    top?: ClothingItem;
    bottom?: ClothingItem;
    shoes?: ClothingItem;
    outerwear?: ClothingItem;
    score: number;
    reason?: string;
  };
  className?: string;
}

const OutfitItem = ({ item, label }: { item?: ClothingItem; label: string }) => {
  if (!item) return null;

  const filename = item.image_path?.split("/").pop() || "";
  const imageUrl = getImageUrl(filename);

  return (
    <div className="flex flex-col items-center gap-3 animate-scale-in">
      <div className="relative group">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-muted shadow-card">
          <img
            src={imageUrl}
            alt={item.description || label}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-soft">
          {label}
        </div>
      </div>
      {item.description && (
        <p className="text-sm text-muted-foreground text-center max-w-[180px] line-clamp-2">
          {item.description}
        </p>
      )}
    </div>
  );
};

const OutfitDisplay = ({ outfit, className }: OutfitDisplayProps) => {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Score */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-accent/20 text-accent font-semibold">
          <Star className="w-4 h-4 fill-current" />
          <span>Match Score: {outfit.score}</span>
        </div>
      </div>

      {/* Outfit Items */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
        {outfit.outerwear && <OutfitItem item={outfit.outerwear} label="Outerwear" />}
        <OutfitItem item={outfit.top} label="Top" />
        <OutfitItem item={outfit.bottom} label="Bottom" />
        {outfit.shoes && <OutfitItem item={outfit.shoes} label="Shoes" />}
      </div>

      {/* Reason */}
      {outfit.reason && (
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-xl p-6 text-center">
            <h4 className="font-serif text-lg font-semibold text-foreground mb-2">
              Why this outfit?
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {outfit.reason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitDisplay;
