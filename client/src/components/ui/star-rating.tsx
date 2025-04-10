import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  max?: number;
  value: number;
  size?: "sm" | "md" | "lg";
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

export function StarRating({
  max = 5,
  value,
  size = "md",
  onChange,
  readOnly = false,
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const displayValue = hoveredRating !== null ? hoveredRating : value;

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4";
      case "lg":
        return "h-7 w-7";
      case "md":
      default:
        return "h-5 w-5";
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (readOnly) return;
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoveredRating(null);
  };

  const handleClick = (rating: number) => {
    if (readOnly || !onChange) return;
    onChange(rating);
  };

  const sizeClass = getSizeClass();

  return (
    <div className="flex items-center">
      {[...Array(max)].map((_, index) => {
        const rating = index + 1;
        return (
          <Star
            key={rating}
            className={cn(
              sizeClass,
              "transition-colors",
              rating <= displayValue
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-slate-300",
              !readOnly && "cursor-pointer hover:text-yellow-400"
            )}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(rating)}
          />
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm text-slate-600">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
