import { ClothingItem, getImageUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ClothingCardProps {
  item: ClothingItem;
  className?: string;
}

const ClothingCard = ({ item, className }: ClothingCardProps) => {
  const filename = item.image_path?.split("/").pop() || "";
  const imageUrl = getImageUrl(filename);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl bg-card shadow-soft hover:shadow-card transition-all duration-300 hover-lift",
        className
      )}
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={item.description || "Clothing item"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {item.category && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
              {item.category}
            </span>
          )}
          {item.sub_category && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {item.sub_category}
            </span>
          )}
        </div>

        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {item.color && (
            <span className="text-xs text-muted-foreground">
              {item.color}
            </span>
          )}
          {item.style && (
            <span className="text-xs text-muted-foreground">
              • {item.style}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClothingCard;
