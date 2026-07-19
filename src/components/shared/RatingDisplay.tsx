import React from "react";

interface RatingDisplayProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  count,
  size = "sm",
  className = "",
}) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.4;
  const starSize = size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-4 h-4" : "w-5 h-5";

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <svg
          key={i}
          className={`${starSize} text-amber-500 fill-amber-500`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(
        <div key={i} className="relative">
          <svg
            className={`${starSize} text-slate-300 dark:text-zinc-700`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <svg
              className={`${starSize} text-amber-500 fill-amber-500`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
        </div>
      );
    } else {
      stars.push(
        <svg
          key={i}
          className={`${starSize} text-slate-300 dark:text-zinc-700`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    }
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">{stars}</div>
      {rating > 0 ? (
        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 ml-1">
          {rating.toFixed(1)}
        </span>
      ) : (
        <span className="text-xs font-medium text-slate-400 dark:text-zinc-500 ml-1">
          No ratings
        </span>
      )}
      {count !== undefined && count > 0 && (
        <span className="text-xs text-slate-500 dark:text-zinc-400">
          ({count})
        </span>
      )}
    </div>
  );
};
